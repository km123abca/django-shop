# Generated by Django 3.0.6 on 2020-07-06 10:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('billing', '0003_chat_message_likes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chat_message_likes',
            name='from_whom',
        ),
        migrations.AddField(
            model_name='chat_message_likes',
            name='from_whom_dislike',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='user_dislike', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='chat_message_likes',
            name='from_whom_like',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='user_like', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Reply_message_likes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('from_whom_dislike', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='replyuser_dislike', to=settings.AUTH_USER_MODEL)),
                ('from_whom_like', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='replyuser_like', to=settings.AUTH_USER_MODEL)),
                ('reply_message', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='replylikes', to='billing.Reply_to_messages')),
            ],
        ),
    ]
