// Formats all deep fields from results.email and sends via EmailJS
// Depends on: alert.js loaded before this file
// results variable comes from results.js — accessed via window.results

function sendEmailReport() {
  const name = document.getElementById('ctaName').value.trim();
  const emailAddr = document.getElementById('ctaEmail').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !emailAddr) {
    showAlert('Please enter your name and email address.');
    return;
  }
  if (!emailRegex.test(emailAddr)) {
    showAlert('Please enter a valid email address.');
    return;
  }

  if (!window.results || !window.results.email) {
    showAlert('No analysis data found. Please run a scan again.');
    return;
  }

  const em = window.results.email;

  // morning routine
  const morningRoutine = (em.morningRoutine || [])
    .map((item, i) => `${i + 1}. ${item.step}\n   → ${item.why}`)
    .join('\n\n');

  //evening routine 
  const eveningRoutine = (em.eveningRoutine || [])
    .map((item, i) => `${i + 1}. ${item.step}\n   → ${item.why}`)
    .join('\n\n');

  // ingredients
  const ingredients = (em.ingredients || [])
    .map(item => `• ${item.name}\n  ${item.benefit}`)
    .join('\n\n');

  // avoid
  const avoid = (em.avoid || [])
    .map(item => `• ${item.ingredient}\n  ${item.reason}`)
    .join('\n\n');

  // lifestyle tips
  const lifestyleTips = (em.lifestyleTips || [])
    .map(item => `• ${item.tip}\n  Impact: ${item.impact}`)
    .join('\n\n');

  // key observations
  const obs = em.keyObservations || {};

  // ── TEMPLATE PARAMS ──
  const templateParams = {
    to_email: emailAddr,
    user_name: name,
    email_summary: em.emailSummary || '',
    detailed_examination: em.detailedExamination || '',
    skin_type: em.skinOverview?.estimatedSkinType || 'N/A',
    skin_age: em.skinOverview?.estimatedSkinAge || 'N/A',
    obs_acne: obs.acnePresence || 'Not detected',
    obs_redness: obs.rednessAreas || 'Not detected',
    obs_pigmentation: obs.pigmentationClusters || 'Not detected',
    obs_undereye: obs.underEyeCondition || 'Not detected',
    obs_elasticity: obs.elasticityAppearance || 'Not assessed',
    root_cause: em.rootCauseAnalysis || '',
    morning_routine: morningRoutine,
    evening_routine: eveningRoutine,
    ingredients: ingredients,
    avoid: avoid,
    lifestyle_tips: lifestyleTips,
    closing: em.closing || ''
  };

  //loading state ── LOADING STATE ──
  const btn = document.querySelector('.email-form button');
  if (!btn) {
    showAlert('Email button not found.');
    return;
  }
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;

  // send via EmailJS
  emailjs.send('service_6wkzx0i', 'template_5snijo7', templateParams)
    .then(() => {
      btn.textContent = '✓ Report Sent!';
      btn.style.background = 'rgba(255,255,255,0.15)';
      btn.style.color = 'white';
      btn.style.letterSpacing = '1px';
    })
    .catch((err) => {
      console.error('EmailJS status:', err.status);
      console.error('EmailJS text:', err.text);
      showAlert('Something went wrong. Please try again.');
    });
}

window.sendEmailReport = sendEmailReport;
