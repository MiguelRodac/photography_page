import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalResourseService {

  constructor() { }

  getLogo(): string {
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTSIofX5NuE1cp5jPDi-Fp6Up4CA8RwZdHaA&s';
  }

  getTitle(): string {
    return 'Photogrtaphy ACAS';
  }

  getFooterText(): string {
    return '© 2023 Photography ACAS™. All Rights Reserved.';
  }

  getSocialMediaLinks(social: string): string {
    switch (social) {
      case 'facebook':
        return 'https://www.facebook.com/ACASphotography/';
      case 'instagram':
        return 'https://www.instagram.com/acasphotography/';
      case 'whatsapp':
        return 'https://wa.me/573178577349';
      default:
        return '';
    }
  }

  formatearFecha(formato: string): string {
    const dateNow = new Date();  // Obtener la fecha actual

    // Obtener los componentes de la fecha
    const month = (dateNow.getMonth() + 1).toString().padStart(2, '0');  // Mes (01-12)
    const day = dateNow.getDate().toString().padStart(2, '0');         // Día (01-31)
    const year = dateNow.getFullYear();                                // Año (YYYY)

    // Reemplazar los tokens en el formato
    return formato
      .replace('MM', month)
      .replace('DD', day)
      .replace('YYYY', String(year));

    // Ejemplo de uso:
    // console.log(formatearFecha("MMDDYYYY"));   // Ejemplo de salida: "02282025" (28 de febrero de 2025)
    // console.log(formatearFecha("DD/MM/YYYY")); // Ejemplo de salida: "28/02/2025" (28 de febrero de 2025)
    // console.log(formatearFecha("YYYY-MM-DD")); // Ejemplo de salida: "2025-02-28" (28 de febrero de 2025)
  }

}
