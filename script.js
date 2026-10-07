

// ገጾችን የመቀያየር ተግባር
function showSection(sectionId) {
    // ሁሉንም ገጾች ደብቅ
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // የተመረጠውን ገጽ ብቻ አሳይ
    const targetPage = document.getElementById(sectionId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // ሞባይል ላይ ከሆነ ሜኑውን ዝጋ
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.remove('active');
}

// የቀድሞው የቋንቋ እና የሞባይል ሜኑ ኮድ እዚህ ይቀጥላል...
function toggleLanguage() {
    document.body.classList.toggle('en-mode');
    document.body.classList.toggle('am-mode');
}

const menuToggle = document.getElementById('mobile-menu');
menuToggle.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});


function toggleMenu(){
    document.getElementById("navDrop").classList.toggle("show")
}

window.onclick = function(event) {
            if (!event.target.matches('.menu-icon')) {
                var dropdowns = document.getElementsByClassName("dropdown");
                for (var i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        }


    const images = document.querySelectorAll(".photo-card img");
    const viewer = document.getElementById("imageViewer");
    const viewerImg = document.getElementById("viewerImg");
    const closeBtn = document.querySelector(".close-btn");

    // Open image
    images.forEach(img => {
        img.addEventListener("click", () => {
            viewer.style.display = "flex";
            viewerImg.src = img.src;
        });
    });

    // Close image
    closeBtn.addEventListener("click", () => {
        viewer.style.display = "none";
    });

    // Close when clicking outside image
    viewer.addEventListener("click", (e) => {
        if (e.target !== viewerImg) {
            viewer.style.display = "none";
        }
    });

    const videos = document.querySelectorAll(".fullscreen-video");

videos.forEach(video => {

    video.addEventListener("click", () => {

        if (video.requestFullscreen) {
            video.requestFullscreen();
        }

    });

});



function toggleMenu() {
  const dropdown = document.getElementById("navDrop");
  
  // Toggles the 'show' class on and off
  dropdown.classList.toggle("show");
}

// Optional: Closes the menu if the user clicks anywhere outside of it
window.onclick = function(event) {
  if (!event.target.matches('.menu-icon')) {
    const dropdown = document.getElementById("navDrop");
    if (dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  }
}



function openDonateModal(){

    document.getElementById("donateModal").style.display = "block";
}


function closeDonateModal(){

    document.getElementById("donateModal").style.display = "block";
}


document.addEventListener("DOMContentLoaded", () => {
  const uploaderNameInput = document.getElementById("uploaderName");
  const registeredName = document.getElementById("registeredName").value.trim().toLowerCase();
  const fileInput = document.getElementById("file-upload");
  const fileNameDisplay = document.getElementById("fileNameDisplay");
  const nameFeedback = document.getElementById("nameFeedback");
  const submitBtn = document.getElementById("submitBtn");

  // Function to validate name and file requirements
  function validateForm() {
    const enteredName = uploaderNameInput.value.trim().toLowerCase();
    const isFileSelected = fileInput.files.length > 0;
    
    // Check if name field is empty
    if (enteredName === "") {
      nameFeedback.textContent = "";
      submitBtn.disabled = true;
      return;
    }

    // Check if entered name matches registered name
    if (enteredName === registeredName) {
      nameFeedback.textContent = "✓ Name matches registration record.";
      nameFeedback.className = "feedback-msg success";
      
      // Only enable submit button if a file is ALSO selected
      if (isFileSelected) {
        submitBtn.disabled = false;
      } else {
        submitBtn.disabled = true;
      }
    } else {
      nameFeedback.textContent = "✗ Name does not match registered member record.";
      nameFeedback.className = "feedback-msg error";
      submitBtn.disabled = true;
    }
  }

  // Update file name display when customer selects a file
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      fileNameDisplay.textContent = fileInput.files[0].name;
    } else {
      fileNameDisplay.textContent = "No file chosen";
    }
    validateForm(); // Re-evaluate after file change
  });

  // Check name validity in real-time as the customer types
  uploaderNameInput.addEventListener("input", validateForm);
});


