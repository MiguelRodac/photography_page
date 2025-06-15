import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"

interface PortfolioItem {
  id: number
  title: string
  category: string
}

interface Service {
  title: string
  description: string
  iconPath: string
  bgClass: string
  buttonClass: string
}

interface Stat {
  value: string
  label: string
  colorClass: string
}

interface SocialLink {
  name: string
  url: string
  iconPath: string
}

@Component({
  selector: 'app-home-v0',
  imports: [ReactiveFormsModule],
  templateUrl: './home-v0.component.html',
  styleUrl: './home-v0.component.scss'
})
export class HomeV0Component {

 title = "nexus-photography"
  currentYear = new Date().getFullYear()
  emailForm: FormGroup
  showMobileMenu = false

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    })
  }

  portfolioItems: PortfolioItem[] = [
    { id: 1, title: "Project 1", category: "Futuristic Portrait" },
    { id: 2, title: "Project 2", category: "Futuristic Portrait" },
    { id: 3, title: "Project 3", category: "Futuristic Portrait" },
    { id: 4, title: "Project 4", category: "Futuristic Portrait" },
    { id: 5, title: "Project 5", category: "Futuristic Portrait" },
    { id: 6, title: "Project 6", category: "Futuristic Portrait" },
  ]

  services: Service[] = [
    {
      title: "Portrait Sessions",
      description: "Cutting-edge portrait photography with advanced lighting techniques and post-processing",
      iconPath:
        "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      bgClass: "bg-gradient-to-r from-cyan-500 to-purple-600",
      buttonClass: "border-cyan-500 text-cyan-400 hover:bg-cyan-500",
    },
    {
      title: "Event Photography",
      description: "Dynamic event coverage with real-time editing and instant delivery systems",
      iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
      bgClass: "bg-gradient-to-r from-purple-500 to-pink-600",
      buttonClass: "border-purple-500 text-purple-400 hover:bg-purple-500",
    },
    {
      title: "Digital Art",
      description: "AI-enhanced digital art creation and photo manipulation for unique visual experiences",
      iconPath:
        "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
      bgClass: "bg-gradient-to-r from-pink-500 to-cyan-600",
      buttonClass: "border-pink-500 text-pink-400 hover:bg-pink-500",
    },
  ]

  stats: Stat[] = [
    { value: "500+", label: "Projects", colorClass: "text-cyan-400" },
    { value: "50+", label: "Awards", colorClass: "text-purple-400" },
    { value: "5", label: "Years", colorClass: "text-pink-400" },
  ]

  socialLinks: SocialLink[] = [
    {
      name: "Instagram",
      url: "#",
      iconPath: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 6.5h11v11h-11z",
    },
    {
      name: "Twitter",
      url: "#",
      iconPath:
        "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
    },
    {
      name: "Email",
      url: "#",
      iconPath: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
    },
  ]

  onSubmit() {
    if (this.emailForm.valid) {
      const email = this.emailForm.get("email")?.value
      console.log("Email submitted:", email)
      alert("¡Gracias por tu interés! Te contactaremos pronto.")
      this.emailForm.reset()
    } else {
      console.log("Form is invalid")
      this.emailForm.markAllAsTouched()
    }
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu
  }

  get emailControl() {
    return this.emailForm.get("email")
  }

  get isEmailInvalid() {
    return this.emailControl?.invalid && this.emailControl?.touched
  }

  get hasEmailRequiredError() {
    return this.emailControl?.errors?.["required"]
  }

  get hasEmailFormatError() {
    return this.emailControl?.errors?.["email"]
  }

}
