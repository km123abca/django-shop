# Generated by Django 3.0.6 on 2020-07-07 11:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0004_auto_20200706_1609'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reply_message_likes',
            name='reply_message',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chatlikes', to='billing.Reply_to_messages'),
        ),
    ]
