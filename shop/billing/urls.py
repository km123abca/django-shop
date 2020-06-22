from django.conf.urls import include, url
from django.urls import path
from . import views

app_name = 'billing'


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^chat/$', views.chat, name='chat'),
    url(r'^chat_json/$', views.chat_json, name='chat_json'),
    url(r'^postchat/$', views.postchat, name='postchat'),
    url(r'^postchat_reply/$', views.postchat_reply, name='postchat_reply'),
    url(r'^register/$', views.UserFormView.as_view(), name='register'),
    url(r'^login/$', views.LoginFormView.as_view(), name='login'),
    url(r'^logout/$', views.logout_user, name='logout_user'),
    url(r'^f/$',views.noPage,name='noPage'),
]
