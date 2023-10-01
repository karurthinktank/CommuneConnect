import logging
import json
import base64

from django.utils import timezone
from .serializers import PeopleSerializer, UserSerializer, FamilyMembersSerializer
from .models import People, FamilyMembers
from rest_framework import permissions
from rest_framework import viewsets, status
from django.contrib.auth.models import Group
from rest_framework.response import Response
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.contrib.auth.base_user import get_random_string

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


class PeopleViewSet(viewsets.ModelViewSet):
    queryset = People.objects.filter(deleted=False)
    serializer_class = PeopleSerializer

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
            case_list = People.objects.filter(deleted=False).order_by(sort_by)
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
            profile_image = request.FILES.get('profile_image')
            data = json.loads(request.POST.get("form_data"))
            data['created_by'] = request.user.first_name
            data['code'] = get_random_string(10)
            if profile_image:
                profile_image = profile_image.read()
                data['profile_image'] = base64.b64encode(profile_image).decode()

            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                serializer.save()
                for member in data['members']:
                    member['name'] = member['member_name']
                    member['code'] = get_random_string(10)
                    member['mobile_number'] = member['member_mobile_number']
                    member['people_id'] = serializer.data['id']
                    member['created_by'] = request.user.first_name
                    people = People.objects.filter(id=serializer.data['id']).first()
                    member['people'] = people
                    if not member['date_of_birth']:
                        member['date_of_birth'] = None

                    member_serializer = FamilyMembersSerializer(data=member)
                    if member_serializer.is_valid():
                        member_serializer.validated_data['people_id'] = serializer.data['id']
                        member_serializer.save()
                    else:
                        response['message'] = "Bad Request!"
                        response['code'] = 400
                        return Response(response, status=status.HTTP_400_BAD_REQUEST)
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
            logging.error(str(e))
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        response = dict()
        data = dict()
        try:
            data = json.loads(request.POST.get("form_data"))
            slug = kwargs.get("pk", None)
            data['modified_by'] = request.user.first_name
            data['modified_at'] = timezone.now()
            people = People.objects.filter(member_id=slug).first()
            if not people:
                logging.error()
                response['message'] = "Invalid Member ID"
                response['code'] = 400
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            profile_image = request.FILES.get('profile_image')
            data['code'] = people.code
            data['created_by'] = people.created_by
            if profile_image:
                profile_image = profile_image.read()
                data['profile_image'] = base64.b64encode(profile_image).decode()
            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                serializer.update(people, serializer.validated_data)
                logging.info({"Member Id": data['member_id'], "message": "Updated Successfully!"})
                for member in data['members']:
                    existing_member = FamilyMembers.objects.filter(code=member['code'], people=people).first()
                    if existing_member:
                        if not member['date_of_birth']:
                            member['date_of_birth'] = None
                        member_serializer = FamilyMembersSerializer(data=member)
                        if member_serializer.is_valid():
                            member_serializer.validated_data['people_id'] = people.id
                            serializer.update(existing_member, member_serializer.validated_data)
                        else:
                            response['message'] = "Bad Request!"
                            response['code'] = 400
                            return Response(response, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        member['code'] = get_random_string(10)
                        member['people_id'] = people.id
                        member['created_by'] = request.user.first_name
                        member['people'] = people
                        if not member['date_of_birth']:
                            member['date_of_birth'] = None

                        member_serializer = FamilyMembersSerializer(data=member)
                        if member_serializer.is_valid():
                            member_serializer.validated_data['people_id'] = people.id
                            member_serializer.validated_data['code'] = get_random_string(10)
                            member_serializer.save()
                        else:
                            response['message'] = "Bad Request!"
                            response['code'] = 400
                            return Response(response, status=status.HTTP_400_BAD_REQUEST)

                # soft delete members
                for deleted in data['deleted_members']:
                    member_instance = FamilyMembers.objects.filter(code=deleted['code'], people=people).first()
                    member_instance.deleted = True
                    member_instance.save()
            else:
                logging.info({"Member ID": data['member_id'], "message": serializer.errors})
                response['message'] = "Bad Request!"
                response['code'] = 400
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            response['message'] = "Updated Successfully!"
            response['code'] = 200
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response['message'] = str(e)
            response['code'] = 500
            logging.error({"Member ID": data['member_id'], "message": str(e)})
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        response = dict()
        try:
            slug = kwargs.get("pk", None)
            people = People.objects.filter(member_id=slug).first()
            if not people:
                logging.info({"User": slug, "message": "Invalid User"})
                response['message'] = "Invalid User"
                response['code'] = 400
                response['data'] = dict()
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            data = self.serializer_class(people, context={'request': request}).data
            family_members = FamilyMembers.objects.filter(people=people, deleted=False)
            data['family_members'] = FamilyMembersSerializer(family_members,
                                                             context={'request': request}, many=True).data
            print(data)
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
            case = People.objects.filter().first()
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

    @action(methods=['get'], detail=False, url_path='get-user')
    def get_user(self, request):
        # qs = self.queryset.filter(id=pk, is_superuser=False).first()
        serializer = UserSerializer(request.user, context={'request': request})
        data = serializer.data
        return Response(data)





