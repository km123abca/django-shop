# Generated by Django 3.0.6 on 2020-07-06 10:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('billing', '0002_auto_20200614_1542'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chat_message_likes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chat_message', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chatlikes', to='billing.Chat_message')),
                ('from_whom', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='chatuser', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
