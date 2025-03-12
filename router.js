let pageUrls = {
	about: "/index.html?about",
	contact: "/index.html?contact",
	gallery: "/index.html?gallery",
	home: "/index.html",
};

function OnStartUp() {
	popStateHandler();
}
OnStartUp();

document.getElementById("theme-toggle").addEventListener("click", () => {
	document.body.classList.toggle("dark-mode");
});

document.querySelector("#home-link").addEventListener("click", (event) => {
	event.preventDefault(); // Zapobiegamy domyślnemu działaniu linku
	let stateObj = { page: "home" };
	document.title = "Home";
	window.location.href = "index.html";
	RenderHomePage();
});

document.querySelector("#about-link").addEventListener("click", (event) => {
	event.preventDefault(); // Zapobiegamy domyślnemu działaniu linku
	let stateObj = { page: "about" };
	document.title = "About";
	history.pushState(stateObj, "about", "?about");
	RenderAboutPage();
});

document.querySelector("#contact-link").addEventListener("click", (event) => {
	event.preventDefault();
	let stateObj = { page: "contact" };
	document.title = "Contact";
	history.pushState(stateObj, "contact", "?contact");
	RenderContactPage();
});

document.querySelector("#gallery-link").addEventListener("click", (event) => {
	event.preventDefault();
	let stateObj = { page: "gallery" };
	document.title = "Gallery";
	history.pushState(stateObj, "gallery", "?gallery");
	RenderGalleryPage();
});

// Strona "O mnie"
function RenderAboutPage() {
	document.querySelector("main").innerHTML = `
    <h1 class="title">About Me</h1>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}

// Strona "Kontakt"
function RenderContactPage() {
	document.querySelector("main").innerHTML = `
    <h1 class="title">Contact with me</h1>
    <form id="contact-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <label for="message">Message:</label>
        <textarea id="message" name="message" required></textarea>

        <!-- CAPTCHA -->
        </p><label for="captcha">Prove you're not a robot:</label>
        <input type="text" id="captcha" name="captcha" required placeholder="Type 4 + 2">

        <button type="submit">Send</button>
    </form>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;

	document
		.getElementById("contact-form")
		.addEventListener("submit", (event) => {
			event.preventDefault();
			validateForm();
		});
}

// Strona "Gallery" - z asynchronicznym ładowaniem obrazów jako BLOB
async function RenderGalleryPage() {
	document.querySelector("main").innerHTML = `
        <h1 class="title">Gallery</h1>
        <div class="gallery-grid" id="gallery-grid">
            <!-- Obrazy będą dodane tutaj -->
        </div>
    `;

	const images = [
		"img/256-1_ani-15-obrazy-na-plotnie-malowany-obraz-konia.jpg.webp",
		"img/1187-obraz-olejny-pejzaz.jpg",
		"img/1260-obrazy-nowoczesne-pejzaz.jpg",
		"img/1320-obrazy-nowoczesne-pejzaz.jpg",
		"img/22620_malowanie-po-numerach-wedrowiec-nad-morzem-mgly--c--d--friedrich-.png.webp",
		"img/a89-0b.jpg",
		"img/pejzaz-olejny-jezioro.jpg",
		"img/ptaki-obraz-do-salonu-cphtkcpdzbrdlwxq.jpg",
		"img/vangogh.jpg",
	];

	const galleryGrid = document.getElementById("gallery-grid");

	// Funkcja do obsługi obrazów z lazy loadingiem
	const loadImage = async (imageSrc, imgElement) => {
		try {
			const response = await fetch(imageSrc);
			const blob = await response.blob();
			const objectURL = URL.createObjectURL(blob);
			imgElement.src = objectURL;
		} catch (error) {
			console.error("Error loading image:", error);
		}
	};

	// Tworzenie IntersectionObserver, aby obrazy ładowały się tylko, gdy wejdą w widoczny obszar
	const observer = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const imgElement = entry.target;
					const imageSrc = imgElement.dataset.src; // Używamy data-src do trzymania ścieżki obrazu
					loadImage(imageSrc, imgElement);
					observer.unobserve(imgElement); // Przestajemy obserwować ten obraz po załadowaniu
				}
			});
		},
		{ threshold: 0.8 }
	); // Ładuje obraz, gdy jest widoczny w 50%

	// Dodaj obrazy do galerii z lazy loadingiem
	images.forEach((image) => {
		const imgElement = document.createElement("img");
		imgElement.alt = "Image";
		imgElement.loading = "lazy"; // Używamy natywnego lazy loadingu
		imgElement.dataset.src = image; // Przechowujemy prawdziwą ścieżkę obrazu w data-src

		// Dodajemy obraz do kontenera, ale nie ładować go natychmiastowo
		galleryGrid.appendChild(imgElement);

		// Obserwujemy obraz za pomocą IntersectionObserver
		observer.observe(imgElement);

		// Dodajemy zdarzenie do powiększenia obrazu po kliknięciu
		imgElement.addEventListener("click", () => {
			openModal(image); // Przekazuje źródło obrazu do modala
		});
	});

	// Tworzymy modal, ale domyślnie jest on ukryty
	const modal = document.createElement("div");
	modal.id = "imageModal";
	modal.classList.add("modal");
	modal.style.display = "none"; // Ukryty modal na początku
	modal.innerHTML = `
        <span id="closeModal" class="close">&times;</span>
        <img id="modalImage" class="modal-content" src="">
    `;
	document.body.appendChild(modal);

	// Obsługuje zamknięcie modala
	document.getElementById("closeModal").addEventListener("click", closeModal);
	window.addEventListener("click", (event) => {
		if (event.target === modal) {
			closeModal();
		}
	});
}

// Funkcja do otwierania modala
function openModal(imageSrc) {
	const modal = document.getElementById("imageModal");
	const modalImage = document.getElementById("modalImage");
	modal.style.display = "flex"; // Pokazujemy modal
	modalImage.src = imageSrc;
}

// Funkcja do zamknięcia modala
function closeModal() {
	const modal = document.getElementById("imageModal");
	modal.style.display = "none"; // Ukrywamy modal
}

function popStateHandler() {
	let loc = window.location.href.toString().split(window.location.host)[1];
	if (loc === pageUrls.contact) {
		RenderContactPage();
	}
	if (loc === pageUrls.about) {
		RenderAboutPage();
	}
	if (loc === pageUrls.gallery) {
		RenderGalleryPage();
	}
}

// Funkcja walidacji formularza
function validateForm() {
	const name = document.getElementById("name").value;
	const email = document.getElementById("email").value;
	const message = document.getElementById("message").value;
	const captcha = document.getElementById("captcha").value;

	// Walidacja pól
	if (!name || !email || !message) {
		alert("All fields are required.");
		return;
	}

	// Walidacja e-maila
	const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (!emailPattern.test(email)) {
		alert("Please enter a valid email address.");
		return;
	}

	// Walidacja CAPTCHA
	if (captcha !== "6") {
		alert("Incorrect CAPTCHA answer. Please try again.");
		return;
	}

	// Jeśli wszystkie walidacje przeszły, wyświetl alert z sukcesem
	alert("Form submitted successfully!");
	// Możesz tu dodać kod do wysyłania formularza na serwer lub innej logiki
}

window.onpopstate = popStateHandler;
