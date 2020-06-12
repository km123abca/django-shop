from django.shortcuts import render, redirect

def noPage(request):
    return HttpResponse("<h1>You are not supposed to be here</h1>")