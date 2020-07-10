
from django.views import generic
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login,logout
from django.views.generic import View
from django.http import HttpResponse,JsonResponse
from .forms import UserForm,UserFormLogin
from .models import *
import json,sys

# Create your views here.


def index(request):
    # return HttpResponse("<h1>Hello World</h1>")
    # print(request.user)
    # if request.user is None or request.user=="AnonymousUser":
    if not request.user.is_authenticated:    
        return redirect('billing:login')
    else:
        us=request.user  
        # print(us.id)      
        return render(request, 'billing/index.html',
                    {
                        "msg": "Alright Friend lets embark on another beautiful journey together",
                        "user": us,                        
                    }
                    )

def chat(request):
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
def chat_json(request):
    jsonChats=[]
    chats=Chat_message.objects.all()

    for chat in chats:
        replies=[]
        for reply in chat.replies.all():
            replies.append({"from_whom":reply.from_whom,
                          "rly_content":reply.rly_content,
                          "sent_when":reply.sent_when,
                          "likes":reply.likes,
                          "dislikes":reply.dislikes,
                          "id":reply.id,
            }) 
        jsonChats.append({"from_whom":chat.from_whom,
                          "msg_content":chat.msg_content,
                          "sent_when":chat.sent_when,
                          "likes":chat.likes,
                          "dislikes":chat.dislikes,
                          "replies":replies,
                          "id":chat.id,
            })


    if request.user.is_authenticated:
        return JsonResponse({"chats":jsonChats})
def postchat(request):
    if request.method=='POST':
        body_content=json.loads(request.body.decode('utf-8'))
        # print(body_content["user"])
        new_msg=Chat_message(from_whom=body_content["user"],
                             msg_content=body_content["msg"],
                            )
        new_msg.save()
        return HttpResponse('{"message":"ok"}')
    else:
        return redirect('billing:noPage')
    # if request.method=='POST':
    #     return HttpResponse("<h1>That was a post request</h1>")
    # else:
    #     return HttpResponse("<h1>That was a get request</h1>")

def dummy_response(request):
    return HttpResponse('{"message":"error"}')

def deleteMainChat(request,chatid):
             
    msg=Chat_message.objects.get(pk=chatid)
    if msg.from_whom==str(request.user):
        print("about to delete message")
        msg.delete()
        return HttpResponse('{"message":"ok"}')
    else:        
        return HttpResponse('{"message":"error"}')

def deleteReply(request,chatid):
             
    msg=Reply_to_messages.objects.get(pk=chatid)
    if msg.from_whom==str(request.user):
        print("about to delete message")
        msg.delete()
        return HttpResponse('{"message":"ok"}')
    else:        
        return HttpResponse('{"message":"error"}')

def post_likes_dislikes(request):
    # print("here")
    try:
        if request.method=='POST':
            # print("here here")
            body_content=json.loads(request.body.decode('utf-8'))
            msg_id=body_content["msg_id"]
            is_msg=bool(body_content["is_msg"])
            is_like=bool(body_content["is_like"])
            if not(is_msg) and is_like:
                print("reply:"+msg_id)

            if is_msg:
                msg=Chat_message.objects.get(pk=msg_id)
                prev_likes=Chat_message_likes.objects.all().filter(chat_message_id=msg_id,is_like=True)
                prev_dislikes=Chat_message_likes.objects.all().filter(chat_message_id=msg_id,is_like=False)
                if is_like and len(prev_dislikes)!=0:
                    prev_dislikes[0].delete()
                    msg.dislikes-=1                    
                elif is_like and len(prev_likes)==0:
                    msg.likes+=1
                    new_entry=Chat_message_likes(chat_message_id=msg_id,from_whom_like_id=request.user.id,is_like=True)
                    new_entry.save()
                elif not(is_like) and len(prev_likes)!=0:
                    prev_likes[0].delete()
                    msg.likes-=1
                elif not(is_like) and len(prev_dislikes)==0:
                    msg.dislikes+=1
                    new_entry=Chat_message_likes(chat_message_id=msg_id,from_whom_like_id=request.user.id,is_like=False)
                    new_entry.save()
                msg.save()
            else:
                try:
                    msg=Reply_to_messages.objects.get(pk=msg_id)                                       
                except:
                    return HttpResponse('{"message":"error","details":"error at line 127"}')
                prev_likes=Reply_message_likes.objects.all().filter(reply_message_id=msg_id,is_like=True) 
                prev_dislikes=Reply_message_likes.objects.all().filter(reply_message_id=msg_id,is_like=False)
                if is_like and len(prev_dislikes)!=0:
                    prev_dislikes[0].delete()
                    msg.dislikes-=1                    
                elif is_like and len(prev_likes)==0:
                    msg.likes+=1
                    new_entry=Reply_message_likes(reply_message_id=msg_id,from_whom_like_id=request.user.id,is_like=True)
                    new_entry.save()
                elif not(is_like) and len(prev_likes)!=0:
                    prev_likes[0].delete()
                    msg.likes-=1
                elif not(is_like) and len(prev_dislikes)==0:
                    msg.dislikes+=1
                    new_entry=Reply_message_likes(reply_message_id=msg_id,from_whom_like_id=request.user.id,is_like=False)
                    new_entry.save()
                msg.save()
            
            return HttpResponse('{"message":"ok"}')
    except:
        # print("Unexpected error:", sys.exc_info()[0])  

        ret_err={"message":"error","details":"Backend Error is unknown"}
        ret_err=json.dumps(ret_err)
       
        return HttpResponse(ret_err)
def postchat_reply(request):
    if request.method=='POST':
        body_content=json.loads(request.body.decode('utf-8'))
        # print(body_content["user"])
        new_msg=Reply_to_messages(from_whom=body_content["user"],
                                  rly_content=body_content["msg"],
                                  chat_message_id=body_content["chatid"]
                                 )
        new_msg.save()
        return HttpResponse('{"message":"ok"}')
    else:
        return redirect('billing:noPage')


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
   