from rest_framework import routers
from users.views import PeopleViewSet
from master_data.views import MasterDataViewSet
# Defining Router
common_router = routers.DefaultRouter()

common_router.register(r'people', PeopleViewSet, basename='people')
common_router.register(r'master-data', MasterDataViewSet, basename='master-data')
