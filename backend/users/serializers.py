from rest_framework import serializers
from .models import Users


class UserSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):

        """ Serialize GenericForeignKey field """

        primitive_repr = super(UserSerializer, self).to_representation(instance)

        return primitive_repr

    class Meta:
        model = Users
        fields = "__all__"



