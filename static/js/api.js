const API = {
  async registerPatient(formData) {
    const res = await fetch("/api/patient/register", {
      method: "POST",
      body: formData
    });
    return await res.json();
  },

  async getDoctors(specialty) {
    const res = await fetch(`/api/doctors/${encodeURIComponent(specialty)}`);
    return await res.json();
  },

  async analyzeSymptoms(formData) {
    const res = await fetch("/api/analyze-symptoms", {
      method: "POST",
      body: formData
    });
    return await res.json();
  },

  async analyzeVisual(formData) {
    const res = await fetch("/api/analyze-visual", {
      method: "POST",
      body: formData
    });
    return await res.json();
  },

  async bookAppointment(formData) {
    const res = await fetch("/api/book-appointment", {
      method: "POST",
      body: formData
    });
    return await res.json();
  }
};