from django.db import models
from django.conf import settings

# Create your models here.
class Chat_message(models.Model):
	from_whom=models.CharField(max_length=250)
	msg_content=models.CharField(max_length=1000)
	sent_when=models.DateTimeField(auto_now_add=True)
	likes=models.IntegerField(default=0)
	dislikes=models.IntegerField(default=0)

	def __str__(self):
		return (self.from_whom+" says "+self.msg_content)

class Reply_to_messages(models.Model):
	chat_message=models.ForeignKey(Chat_message,related_name='replies',on_delete=models.CASCADE)
	from_whom=models.CharField(max_length=250)
	rly_content=models.CharField(max_length=1000)
	sent_when=models.DateTimeField(auto_now_add=True)
	likes=models.IntegerField(default=0)
	dislikes=models.IntegerField(default=0)

	# class Meta:
	# 	unique_together = ['chat_message', 'from_whom']

	def __str__(self):
		return '%s: %s' % (self.from_whom, self.rly_content)

class Chat_message_likes(models.Model):
	chat_message=models.ForeignKey(Chat_message,related_name='chatlikes',on_delete=models.CASCADE)
	from_whom_like= models.ForeignKey(settings.AUTH_USER_MODEL, default=1,related_name='user_like',on_delete=models.CASCADE)
	is_like=models.BooleanField(default=True)

class Reply_message_likes(models.Model):
	reply_message=models.ForeignKey(Reply_to_messages,related_name='chatlikes',on_delete=models.CASCADE)
	from_whom_like= models.ForeignKey(settings.AUTH_USER_MODEL, default=1,related_name='replyuser_like',on_delete=models.CASCADE)
	is_like=models.BooleanField(default=True)

