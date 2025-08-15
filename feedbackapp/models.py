from django.db import models


class Feedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    visit_date = models.DateField()

    visit_time = models.CharField(
        max_length=10,
        choices=[('Lunch', 'Lunch'), ('Dinner', 'Dinner')]
    )

    food_rating = models.IntegerField(null=False)
    cleanliness_rating = models.IntegerField(null=False)
    ambience_rating = models.IntegerField(null=False)
    service_rating = models.IntegerField(null=False)
    overall_rating = models.IntegerField(null=False)

    comment = models.TextField(blank=True)
    suggestions = models.TextField(blank=True)

    recommendation = models.CharField(
        max_length=5,
        choices=[('Yes', 'Yes'), ('No', 'No')]
    )

    class Meta:
        db_table = 'feedback'
        managed = False

    def __str__(self):
        return f"{self.name or 'Anonymous'} ({self.visit_date})"


