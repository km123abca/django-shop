
from django.views import generic
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.views.generic import View
from .forms import UserForm

# Create your views here.


def index(request):
    # return HttpResponse("<h1>Hello World</h1>")
    return render(request, 'billing/index.html',
                  {
                      "msg": "Alright Friend lets embark on another beautiful journey together",
                      "user": request.user.username,
                  }
                  )


class UserFormView(View):
    form_class = UserForm
    template_name = 'billing/login.html'

    def get(self, request):
        form = self.form_class(None)
        return render(request, self.template_name, {'form': form})

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
                return redirect('billing:index')
        return render(request, self.template_name, {'form': form})
