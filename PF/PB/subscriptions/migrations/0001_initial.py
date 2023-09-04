# Generated by Django 4.1.3 on 2022-11-20 05:45

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("studios", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="SubscriptionPlan",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=200)),
                ("price", models.DecimalField(decimal_places=2, max_digits=4)),
                ("duration", models.DurationField()),
                ("description", models.CharField(max_length=200)),
                (
                    "subscription_type",
                    models.CharField(
                        choices=[
                            ("one_time", "One-time Flat Payment"),
                            ("recurring", "Recurring Payment"),
                        ],
                        max_length=200,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Subscription",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("start_date", models.DateField()),
                ("end_date", models.DateField()),
                ("payment_time", models.DateField()),
                ("card_name", models.CharField(max_length=200)),
                ("card_number", models.CharField(max_length=200)),
                (
                    "plan",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="subscriptions.subscriptionplan",
                    ),
                ),
                (
                    "studio",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="studios.studio"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]