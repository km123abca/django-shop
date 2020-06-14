from django.db import models

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
