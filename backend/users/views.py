import logging
import json
from django.utils import timezone
from .serializers import UserSerializer
from .models import Users
from rest_framework import permissions
from rest_framework import viewsets, status
from django.contrib.auth.models import Group
from rest_framework.response import Response
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage

from django.db.models import Q
from rest_framework.views import APIView
# from common.custom_exceptions import DevOpsValidationErr
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.serializers import TokenVerifySerializer
import datetime
from rest_framework.decorators import action


"""
User creation, list, view, edit and delete
"""


class UsersViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.filter(deleted=False)
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        """
        User List API
        Args:
            request:
            *args:
            **kwargs:

        Returns: Json Response

        """
        response = dict()
        try:
            query_params = request.GET.copy()
            page = query_params.get("page", 1)
            count = query_params.get("count", 50)
            search_text = query_params.get("search", None)
            sort_by = query_params.get("sort_by", "id")
            order_by = query_params.get("order_by", None)
            if order_by and order_by == "asc":
                sort_by = "-" + sort_by
            try:
                count = int(count)
                count = 200 if count > 200 else count
            except Exception:
                count = 50

            try:
                page = int(page)
            except Exception:
                page = 1
            case_list = Users.objects.filter(deleted=False).order_by(sort_by)
            paginator = Paginator(case_list, count)
            try:
                resource = paginator.page(page)
            except PageNotAnInteger:
                resource = paginator.page(1)
            except EmptyPage:
                resource = paginator.page(paginator.num_pages)

            data = self.serializer_class(resource, context={'request': request}, many=True).data
            payload = {
                "data": data,
                "current_page": resource.number,
                "total_count": case_list.count(),
                "has_next": resource.has_next(),
                "has_previous": resource.has_previous(),
                "count": count,
                "total_pages": resource.paginator.num_pages,
                "message": "Success"
            }
            return Response(payload, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(str(e))
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        """
        Create Case
        Args:
            request:
            *args:
            **kwargs:

        Returns: Json Response

        """
        response = dict()
        data = dict()
        try:
            data = request.body
            data = json.loads(data)
            data['created_by'] = request.user.id
            if not data['filing_date']:
                data['filing_date'] = None
            if not data['registration_date']:
                data['registration_date'] = None
            existing_case = Users.objects.filter()
            if existing_case:
                logging.error({"CNR": data['cnr_number'], "message": "Duplicate CNR Number"})
                response['message'] = "Duplicate CNR number"
                response['code'] = 400
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                serializer.save()
                logging.info({"CNR": data['cnr_number'], "message": "Created Successfully!"})
            else:
                response['message'] = "Bad Request!"
                response['code'] = 400
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            response['message'] = "Created Successfully!"
            response['code'] = 201
            return Response(response, status=status.HTTP_201_CREATED)
        except Exception as e:
            response['message'] = str(e)
            response['code'] = 500
            logging.error({"CNR": data['cnr_number'], "message": str(e)})
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        response = dict()
        data = dict()
        try:
            data = request.body
            data = json.loads(data)
            data['modified_by'] = request.user
            data['modified_at'] = timezone.now()
            case = Users.objects.filter()
            if not case:
                logging.error({"case": data['cnr_number'], "message": "Invalid CNR number"})
                response['message'] = "Invalid CNR Number"
                response['code'] = 400
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                serializer.save()
                logging.info({"CNR": data['cnr_number'], "message": "Updated Successfully!"})
            else:
                logging.info({"CNR": data['cnr_number'], "message": serializer.errors})
                response['message'] = "Bad Request!"
                response['code'] = 400
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            response['message'] = "Updated Successfully!"
            response['code'] = 200
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response['message'] = str(e)
            response['code'] = 500
            logging.error({"CNR": data['cnr_number'], "message": str(e)})
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        response = dict()
        try:
            slug = kwargs.get("pk", None)
            case = Users.objects.filter().first()
            if not case:
                logging.info({"case": slug, "message": "Invalid Case"})
                response['message'] = "Invalid Case"
                response['code'] = 400
                response['data'] = dict()
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            data = self.serializer_class(case, context={'request': request}).data
            response['message'] = "Success!"
            response['code'] = 200
            response['data'] = data
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response['message'] = str(e)
            response['code'] = 500
            response['data'] = dict()
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        response = dict()
        try:
            slug = kwargs.get("pk", None)
            case = Users.objects.filter().first()
            case.deleted = True
            case.modified_by = request.user
            case.modified_at = timezone.now()
            case.save()
            response['message'] = "Deleted Successfully!"
            response['code'] = 200
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response['message'] = str(e)
            response['code'] = 500
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





