
from django.views import generic
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login,logout
from django.views.generic import View
from .forms import UserForm,UserFormLogin
from .models import *

# Create your views here.


def index(request):
    # return HttpResponse("<h1>Hello World</h1>")
    print(request.user)
    # if request.user is None or request.user=="AnonymousUser":
    if not request.user.is_authenticated:    
        return redirect('billing:login')
    else:
        us=request.user        
        return render(request, 'billing/index.html',
                    {
                        "msg": "Alright Friend lets embark on another beautiful journey together",
                        "user": us,                        
                    }
                    )

def chat(request):
    # return HttpResponse("<h1>Hello World</h1>")
    print(request.user)
    # if request.user is None or request.user=="AnonymousUser":
    if not request.user.is_authenticated:
        request.session['askedfor']='billing:chat'    
        return redirect('billing:login')
    else:
        us=request.user
        chats=Chat_message.objects.all()
        return render(request, 'billing/chatwindow.html',
                                {                        
                                    "user": us,
                                    "forum_title":"Common",
                                    "chats":chats,
                                }
                     )

class LoginFormView(View):
    form_class=UserFormLogin
    template_name = 'billing/register.html'
    def get(self, request):
        form = self.form_class(None)
        if request.session.has_key('askedfor'):
            return render(request, self.template_name, {'form': form,'title':'Login','err':'You have to Login First'})    
        return render(request, self.template_name, {'form': form,'title':'Login'})

    def post(self,request):
        form=self.form_class(request.POST)        
        if form.is_valid():
            username=form.cleaned_data['username']
            password=form.cleaned_data['password']
            user=authenticate(username=username,password=password)
            
            if user is not None and user.is_active:
                login(request,user)
                if request.session.has_key('askedfor'):
                    x=request.session['askedfor']
                    del request.session['askedfor']
                    return redirect(x)
                return redirect('billing:index')
            return render(request, self.template_name, {'form': form,'title':'Login','error_message':'Wrong credentials'})
        
        return render(request, self.template_name, {'form': form,'title':'Login'})

class UserFormView(View):
    form_class = UserForm
    template_name = 'billing/register.html'

    def get(self, request):
        form = self.form_class(None)
        return render(request, self.template_name, {'form': form,'title':'Register'})

    def post(self, request):
        form = self.form_class(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            # cleaned and normalized data
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user.set_password(password)
            user.save()

            user = authenticate(username=username, password=password)

            if user.is_active:
                # thats it.... User is logged in now, we can now refer to the user as request.user.username.etc
                login(request, user)
                if request.session.has_key('askedfor'):
                    x=request.session['askedfor']
                    del request.session['askedfor']
                    return redirect(x)
                return redirect('billing:index')
            return render(request, self.template_name, {'form': form,'title':'Register','error_message':'Wrong credentials'})
        return render(request, self.template_name, {'form': form,'title':'Register','error_message':'LOGIN FAILED'})

def logout_user(request):
    logout(request)
    return redirect('billing:login')

def noPage(request):
    return render(request,'billing/404.html')
   