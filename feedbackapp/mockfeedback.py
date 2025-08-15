# Save this code into a file, e.g., generate_feedback_data_django.py
# Then, run it from within the Django shell.

import datetime
import random
import string
from django.utils import timezone # For better date handling in Django

# Assuming your Feedback model is accessible, e.g., from an 'app_name.models' import
# Replace 'your_app_name' with the actual name of your Django app where the Feedback model resides.
try:
    from feedbackapp.models import Feedback
except ImportError:
    print("Error: Could not import the 'Feedback' model.")
    print("Please ensure 'your_app_name' is replaced with the actual name of your Django app.")
    print("And that the model is defined in your_app_name/models.py")
    exit()

def generate_and_save_mock_feedback(num_entries):
    """
    Generates and saves mock data for the Feedback model directly into the database.
    Ratings are adjusted to be between 1 and 5.
    """
    print(f"Generating {num_entries} mock feedback entries...")
    created_count = 0
    for _ in range(num_entries):
        name_choice = random.choice([
            "Alice",
            "Bob",
            "Charlie",
            "David",
            "Eve",
            None, # ~1/6 chance of null name
        ])
        
        name = None
        if name_choice:
            name = name_choice + " " + "".join(
                random.choices(string.ascii_uppercase, k=1)
            ) + "."

        email = None
        # If name is not None, there's a 10% chance email will be blank.
        # If name is None, email will also be blank as per your model definition (blank=True).
        if name and random.random() > 0.1: 
            email = (
                name.lower().replace(" ", "")
                + f"{random.randint(1,100)}@example.com"
            )
        
        # Generate a random date within the last year
        start_date = timezone.now() - datetime.timedelta(days=365)
        end_date = timezone.now()
        time_between_dates = end_date - start_date
        days_between_dates = time_between_dates.days
        random_number_of_days = random.randrange(days_between_dates)
        visit_date = (start_date + datetime.timedelta(days=random_number_of_days)).date() # .date() to get just the date part

        visit_time = random.choice(["Lunch", "Dinner"]) # Directly use string values
        
        # Ratings 1-5
        food_rating = random.randint(1, 5)
        cleanliness_rating = random.randint(1, 5)
        ambience_rating = random.randint(1, 5)
        service_rating = random.randint(1, 5)
        
        # Calculate overall rating as the average, clamped to 1-5
        overall_rating = round(
            (
                food_rating
                + cleanliness_rating
                + ambience_rating
                + service_rating
            )
            / 4
        )
        overall_rating = max(1, min(5, overall_rating)) # Ensure rating is within 1-5

        comment = random.choice(
            [
                "Fantastic food and great atmosphere.",
                "Service was a bit slow, but the food made up for it.",
                "Cleanliness could be improved.",
                "Loved the authentic taste!",
                "Average experience, nothing special.",
                "Highly recommend the butter chicken.",
                "A pleasant surprise, will definitely return.",
                "",  # Using empty string for blank=True fields, not None
            ]
        )

        suggestions = random.choice(
            [
                "More vegan options.",
                "Faster seating during peak hours.",
                "Introduce a loyalty program.",
                "Update the interior decor.",
                "Offer cooking classes.",
                "",  # Using empty string for blank=True fields, not None
            ]
        )

        recommendation = random.choice(["Yes", "No"]) # Directly use string values

        try:
            Feedback.objects.create(
                name=name if name else "", # Django stores blank=True CharFields as empty strings, not NULL
                email=email if email else "", # Django stores blank=True EmailFields as empty strings, not NULL
                visit_date=visit_date,
                visit_time=visit_time,
                food_rating=food_rating,
                cleanliness_rating=cleanliness_rating,
                ambience_rating=ambience_rating,
                service_rating=service_rating,
                overall_rating=overall_rating,
                comment=comment,
                suggestions=suggestions,
                recommendation=recommendation,
            )
            created_count += 1
        except Exception as e:
            print(f"Error creating feedback entry: {e}")

    print(f"Successfully created {created_count} feedback entries.")
    if created_count < num_entries:
        print(f"Failed to create {num_entries - created_count} entries due to errors.")


if __name__ == '__main__':
    # This block will only execute if the script is run directly,
    # which is not how you typically run it in the Django shell.
    # It's primarily here for completeness if one wanted to make it standalone.
    # For Django shell, you will paste or load the function call directly.
    print("This script is designed to be run within the Django shell.")
    print("1. Start your Django shell: python manage.py shell")
    print("2. Copy and paste the 'generate_and_save_mock_feedback' function definition.")
    print("3. Call the function, e.g.: generate_and_save_mock_feedback(50)")
