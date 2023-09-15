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


class People(models.Model):
    # organization = models.ForeignKey()
    name = models.CharField(max_length=250)
    mobile_number = models.CharField(max_length=10)
    deleted = models.BooleanField(default=0)
    receipt_no = models.CharField(max_length=100, null=True, blank=True)
    receipt_date = models.DateField(null=True)
    receipt_book_no = models.CharField(max_length=100, null=True, blank=True)
    is_group_member = models.BooleanField(default=False)
    member_registration_number = models.CharField(max_length=100, null=True, blank=True)
    current_address = models.TextField()
    permanent_address = models.TextField(null=True, blank=True)
    country = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    district = models.CharField(max_length=50)
    area = models.CharField(max_length=50, null=True, blank=True)
    panchayat = models.CharField(max_length=50, null=True, blank=True)
    village = models.CharField(max_length=50, null=True, blank=True)
    postal_code = models.CharField(max_length=50, null=True, blank=True)
    secondary_mobile_number = models.CharField(max_length=10, null=True, blank=True)
    country_code = models.CharField(max_length=10, null=True, blank=True)
    international_mobile_number = models.CharField(max_length=15, null=True, blank=True)
    std_code = models.IntegerField(null=True)
    phone_number = models.CharField(max_length=10, null=True, blank=True)
    profile_image = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(null=True)
    created_by = models.CharField(max_length=100)
    updated_by = models.CharField(max_length=100, null=True, blank=True)


class FamilyMembers(models.Model):
    people = models.ForeignKey(People, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    aadhar_no = models.CharField(max_length=20, null=True, blank=True)
    mobile_number = models.CharField(max_length=10)
    gender = models.CharField(max_length=10)
    relationship = models.CharField(max_length=50)
    date_of_birth = models.DateField(null=True)
    martial_status = models.CharField(max_length=50, null=True, blank=True)
    occupation = models.CharField(max_length=50, null=True, blank=True)
    career_reference = models.CharField(max_length=50, null=True, blank=True)
    blood_group = models.CharField(max_length=20, null=True, blank=True)
    card_details = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(null=True)
    created_by = models.CharField(max_length=100)
    updated_by = models.CharField(max_length=100, null=True, blank=True)



