// This function is called from main.js after the user completes the survey and uploads their photo.
async function analyzePhoto() {
  try {
    const formData = new FormData();
    formData.append('survey', JSON.stringify(userData.survey));
    formData.append('photo', userData.photo);

    const response = await fetch('https://dermascan-backend-5u4m.onrender.com/analyze', {
      method: 'POST',
      body: formData
    });

    // Handle API errors and surface backend message when available.
    if (!response.ok) {
      const errText = await response.text();
      let errJson = null;
      try {
        errJson = JSON.parse(errText);
      } catch (_) {
        // keep null if response isn't JSON
      }

      console.error('Server error response:', errText.slice(0, 500));
      const error = new Error(errJson?.message || `Server returned ${response.status}`);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();

    if (!data.success) {
      showAlert(data.message || 'Analysis failed. Please try again.');
      document.getElementById('analyzingOverlay').classList.remove('show');
      document.getElementById('step2').style.display = 'block';
      return;
    }

    sessionStorage.setItem('skinResults', JSON.stringify(data.results));
    sessionStorage.setItem('skinUser', JSON.stringify(data.user));
    sessionStorage.setItem('skinRecommendations', JSON.stringify(data.recommendations));

    window.location.href = 'results.html';

  } catch (error) {
    console.error('Error:', error);
    const friendlyMessage = error?.status === 429
      ? (error.message || 'Gemini quota exceeded. Please try again shortly.')
      : 'Something went wrong. Please try again.';
    showAlert(friendlyMessage);
    document.getElementById('analyzingOverlay').classList.remove('show');
    document.getElementById('step2').style.display = 'block';
  }
}
