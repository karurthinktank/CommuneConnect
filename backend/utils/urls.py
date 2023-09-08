from rest_framework import routers
from users.views import UsersViewSet
from master_data.views import MasterDataViewSet
# Defining Router
common_router = routers.DefaultRouter()

common_router.register(r'users', UsersViewSet, basename='users')
common_router.register(r'master-data', MasterDataViewSet, basename='master-data')
