from django.conf.urls import include, url
from django.urls import path
from . import views

app_name = 'billing'


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^login/$', views.UserFormView.as_view(), name='login'),
]
