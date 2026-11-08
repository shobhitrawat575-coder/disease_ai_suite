from doctor_slots import DOCTORS_DATABASE

def get_doctors_by_specialty(specialty: str) -> list:
    return DOCTORS_DATABASE.get(specialty, DOCTORS_DATABASE["Endocrinologist"])