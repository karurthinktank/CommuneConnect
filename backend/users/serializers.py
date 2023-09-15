from rest_framework import serializers
from .models import People, FamilyMembers, TMSUser


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = TMSUser
        fields = ("username", "first_name", "email", "last_name")


class PeopleSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):

        """ Serialize GenericForeignKey field """

        primitive_repr = super(PeopleSerializer, self).to_representation(instance)

        return primitive_repr

    class Meta:
        model = People
        fields = "__all__"


class FamilyMembersSerializer(serializers.ModelSerializer):
    people = PeopleSerializer(read_only=True)

    class Meta:
        model = FamilyMembers
        fields = "__all__"



