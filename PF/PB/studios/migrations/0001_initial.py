# Generated by Django 4.1.3 on 2022-11-20 05:45

import datetime
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Class",
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
                ("description", models.TextField()),
                ("coach", models.CharField(max_length=200)),
                ("capacity", models.IntegerField()),
                (
                    "start_time",
                    models.DateTimeField(blank=True, default=datetime.datetime.now),
                ),
                (
                    "end_time",
                    models.DateTimeField(blank=True, default=datetime.datetime.now),
                ),
                (
                    "period",
                    models.IntegerField(
                        default=7,
                        validators=[django.core.validators.MinValueValidator(0)],
                    ),
                ),
                ("keywords", models.TextField(default="")),
            ],
        ),
        migrations.CreateModel(
            name="ClassInstance",
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
                ("time", models.DateTimeField()),
                ("current_capacity", models.IntegerField()),
                (
                    "classobj",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="studios.class"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Studio",
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
                ("address", models.CharField(max_length=200)),
                ("longitude", models.FloatField()),
                ("latitude", models.FloatField()),
                ("postal_code", models.CharField(max_length=200)),
                ("phone_number", models.CharField(max_length=200)),
                ("user_distance", models.FloatField(default=0.0)),
            ],
        ),
        migrations.CreateModel(
            name="UsersEnrolled",
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
                (
                    "classinstance",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="studios.classinstance",
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
        migrations.CreateModel(
            name="StudioImages",
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
                (
                    "image",
                    models.ImageField(
                        blank=True, null=True, upload_to="__directory-name__"
                    ),
                ),
                (
                    "studio",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="studios.studio"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="StudioAmenities",
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
                ("type", models.CharField(max_length=200)),
                ("quantity", models.IntegerField()),
                (
                    "studio",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="studios.studio"
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="class",
            name="studio",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="studios.studio"
            ),
        ),
    ]
