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
from django.conf import settings

from django.db.models import Q
from rest_framework.views import APIView
# from common.custom_exceptions import DevOpsValidationErr
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.serializers import TokenVerifySerializer
import datetime
from rest_framework.decorators import action
from utils.google_ import upload_from_string


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
            q_object = Q()
            if order_by and order_by == "asc":
                sort_by = "-" + sort_by

            if search_text:
                q_object.add(Q(name__icontains=search_text) | Q(mobile_number__icontains=search_text) |
                          Q(member_id__icontains=search_text), Q.OR)
            try:
                count = int(count)
                count = 200 if count > 200 else count
            except Exception:
                count = 50

            try:
                page = int(page)
            except Exception:
                page = 1
            user_list = People.objects.filter(q_object, deleted=False).order_by(sort_by)
            paginator = Paginator(user_list, count)
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
                "total_count": user_list.count(),
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
        response['error'] = None
        data = dict()
        try:
            profile_image = request.FILES.get('profile_image')
            if profile_image:
                data['profile_image'] = self.upload_images(profile_image, "profile", data['member_id'])
            data = json.loads(request.POST.get("form_data"))
            existing_instance = People.objects.filter(member_id=data['member_id']).first()
            if existing_instance:
                response['message'] = "Member Id already exist! Kindly update correct Member ID"
                response['code'] = 400
                response['error'] = "Member Id already exist! Kindly update correct Member ID"
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            data['created_by'] = request.user.first_name
            if profile_image:
                profile_image = profile_image.read()
                data['profile_image'] = base64.b64encode(profile_image).decode()
            if data['profile_image'] and data['mobile_number'] and data['current_address']:
                data['is_profile_completed'] = True
            if not data['receipt_date']:
                data['receipt_date'] = None

            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                serializer.validated_data['member_id'] = data['member_id']
                serializer.save()
                for member in data['members']:
                    member['name'] = member['member_name']
                    member['mobile_number'] = member['member_mobile_number']
                    member['people_id'] = serializer.data['id']
                    member['created_by'] = request.user.first_name
                    people = People.objects.filter(id=serializer.data['id']).first()
                    member['people'] = serializer.data['id']
                    if not member['date_of_birth']:
                        member['date_of_birth'] = None

                    member_serializer = FamilyMembersSerializer(data=member)
                    if member_serializer.is_valid():
                        # member_serializer.validated_data['people_id'] = serializer.data['id']
                        member_serializer.save()
                    else:
                        people.delete()
                        response['message'] = "Bad Request!"
                        response['code'] = 400
                        response['error'] = member_serializer.errors
                        return Response(response, status=status.HTTP_400_BAD_REQUEST)
            else:
                response['message'] = "Bad Request!"
                response['error'] = serializer.errors
                response['code'] = 400
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            response['message'] = "Created Successfully!"
            response['code'] = 201
            return Response(response, status=status.HTTP_201_CREATED)
        except Exception as e:
            response['message'] = "Internal Server Error!"
            response['error'] = str(e)
            response['code'] = 500
            logging.error(str(e))
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        response = dict()
        response['error'] = None
        data = dict()
        try:
            data = json.loads(request.POST.get("form_data"))
            slug = kwargs.get("pk", None)
            data['modified_by'] = request.user.first_name
            data['modified_at'] = timezone.now()
            people = People.objects.filter(member_id=slug).first()
            if not people:
                logging.error("")
                response['message'] = "Invalid Member ID"
                response['code'] = 400
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            profile_image = request.FILES.get('profile_image')
            data['created_by'] = people.created_by
            if profile_image:
                data['profile_image'] = self.upload_images(profile_image, "profile", data['member_id'])
            if not data['receipt_date']:
                data['receipt_date'] = None
            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                serializer.update(people, serializer.validated_data)
                # updated instance
                people = People.objects.filter(member_id=slug).first()
                # check profile is completed
                if people.mobile_number and people.profile_image and people.current_address:
                    people.is_profile_completed = True
                else:
                    people.is_profile_completed = False
                people.save()
                logging.info({"Member Id": data['member_id'], "message": "Updated Successfully!"})
                for member in data['members']:
                    existing_member = FamilyMembers.objects.filter(id=member['id'], people=people).first()
                    if existing_member:
                        if not member['date_of_birth']:
                            member['date_of_birth'] = None
                        member_serializer = FamilyMembersSerializer(data=member)
                        if member_serializer.is_valid():
                            # member_serializer.validated_data['people_id'] = people.id
                            serializer.update(existing_member, member_serializer.validated_data)
                        else:
                            response['message'] = "Bad Request!"
                            response['code'] = 400
                            return Response(response, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        member['people'] = people.id
                        member['created_by'] = request.user.first_name
                        if not member['date_of_birth']:
                            member['date_of_birth'] = None

                        member_serializer = FamilyMembersSerializer(data=member)
                        if member_serializer.is_valid():
                            # member_serializer.validated_data['people_id'] = people.id
                            member_serializer.save()
                        else:
                            response['message'] = "Bad Request!"
                            response['code'] = 400
                            response['error'] = member_serializer.errors
                            return Response(response, status=status.HTTP_400_BAD_REQUEST)

                # soft delete members
                for deleted in data['deleted_members']:
                    member_instance = FamilyMembers.objects.filter(id=deleted['id'], people=people).first()
                    member_instance.deleted = True
                    member_instance.save()
            else:
                logging.info({"Member ID": data['member_id'], "message": serializer.errors})
                response['message'] = "Bad Request!"
                response['code'] = 400
                response['error'] = serializer.errors
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            response['message'] = "Updated Successfully!"
            response['code'] = 200
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response['message'] = "Internal Server Error!"
            response['error'] = str(e)
            response['code'] = 500
            logging.error({"Member ID": data['member_id'], "message": str(e)})
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @staticmethod
    def upload_images(attachment, folder, member_id):
        try:
            obj = dict()
            # attachment = request.FILES.get(file)
            file_content = attachment.read()
            content_type = attachment.content_type
            extension = attachment.name.split(".")[-1]
            name = "{}-profile".format(str(member_id))
            file_name = "{}/{}{}".format(folder, name, extension)
            blob = upload_from_string(
                file_content,
                content_type,
                file_name,
                settings.BUCKET_NAME)
            if blob:
                obj = {
                    "bucket_name": blob.bucket.name,
                    "file_path": blob.name,
                    "name": attachment.name,
                    "public_url": blob.public_url,
                    "media_link": blob.media_link
                }
            return obj
        except Exception as e:
            logging.error(str(e))
            raise e

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

    @action(methods=['post'], detail=True, url_path='card-map')
    def card_map(self, request, pk):
        response = dict()
        try:
            data = request.data
            people = People.objects.filter(member_id=pk).first()
            people.modified_by = request.user.first_name
            people.modified_at = timezone.now()
            people.is_card_mapped = True
            people.id_card_no = data['card_no']
            people.save()
            response['message'] = "Card Mapped Successfully!"
            response['code'] = 200
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response['message'] = str(e)
            response['code'] = 500
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DashboardViewSet(viewsets.ModelViewSet):
    queryset = People.objects.filter(deleted=False)
    serializer_class = PeopleSerializer

    def list(self, request, *args, **kwargs):
        try:
            family_count = self.queryset.count()
            members = FamilyMembers.objects.filter(deleted=False)
            total_members_count = family_count + members.count()
            card_mapped_count = self.queryset.filter(is_card_mapped=True).count()
            male_count = self.queryset.filter(gender="ஆண்").count() + members.filter(gender="ஆண்").count()
            female_count = self.queryset.filter(gender="பெண்").count() + members.filter(gender="பெண்").count()
            response = {
                "family_count": family_count,
                "members_count": total_members_count,
                "id_card_count": card_mapped_count,
                "male_count": male_count,
                "female_count": female_count
            }
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)






