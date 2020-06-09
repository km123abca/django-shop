from django.conf.urls import include, url
from django.urls import path
from . import views

app_name = 'billing'


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^register/$', views.UserFormView.as_view(), name='register'),
    url(r'^login/$', views.LoginFormView.as_view(), name='login'),
    url(r'^logout/$', views.logout_user, name='logout_user'),
]
