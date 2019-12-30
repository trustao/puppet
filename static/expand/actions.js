window.addEventListener('load', () => {
  setTimeout(() => {
    if (location.hostname === 'ups.jclps.com' && location.pathname === '/login') {
      const doc = document.querySelector('.login-frame').contentWindow.document
      doc.querySelector('#loginname').value = '9红红火火'
      doc.querySelector('#nloginpwd').value = 'hong123456'
      doc.querySelector('#paipaiLoginSubmit').click()
    }
  }, 1000)
})