# Create your models here.
from django.contrib.auth.models import AbstractUser, Group
from django.db import models
from django.conf import settings
from django.core.validators import validate_comma_separated_integer_list


class TMSUser(AbstractUser):
    last_name = models.CharField(null=True, blank=True, max_length=150)
    email = models.EmailField(max_length=100, unique=True)
    username = models.CharField(max_length=100, unique=True)
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name', 'email']


class Users(models.Model):
    # organization = models.ForeignKey()
    first_name = models.CharField(max_length=250)
    mobile_number = models.CharField(max_length=10)
    deleted = models.BooleanField(default=0)


