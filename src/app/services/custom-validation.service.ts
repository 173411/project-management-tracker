import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

@Injectable({
  providedIn: 'root' // Available across all modules
})

export class CustomValidationService {
    constructor() {
        
    }

    minSelection(min: number)  {
        return (control: AbstractControl): ValidationErrors | null => {
            const selectedOptions = control.value;
            if (!Array.isArray(selectedOptions) || selectedOptions.length < min) {
              return { 'minSelection': { value: selectedOptions?.length || 0, requiredMin: min } }; // Invalid  
            }
            return null; // Valid            
        };
    }

    minSelection2(min: number): ValidatorFn | null {
        return (control: AbstractControl) => {
            const selectedOptions = control.value;
            if (Array.isArray(selectedOptions) && selectedOptions.length >= min) {
                return null; // Valid
            }
            return { 'minSelection': { value: control.value, requiredMin: min } }; // Invalid
        };
    }

    projectDateValidator(startDateControl: string, endDateControl: string): ValidatorFn | null {
        return (group: AbstractControl) => {
            
            const startDate = group.get(startDateControl)?.value;
            const endDate = group.get(endDateControl)?.value;

            if (!startDate || !endDate) {
                return null; // Let required validators handle this
            }
            
            const startDt = new Date(startDate.year, startDate.month - 1, startDate.day); // Adjust month for Date constructor
            const endDt = new Date(endDate.year, endDate.month - 1, endDate.day);
            if (startDate && endDate && endDt <= startDt) {
                return { dateRangeInvalid: true };
            }
            return null; // Valid
        }
    }

    XSSValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (typeof value === 'string' && /<script.*?>.*?<\/script.*?>|javascript:|on\w+=|<.*?on\w+=.*?>/gi.test(value)) {
                return { xssDetected: true }; // Invalid
            }
            return null; // Valid
        };
    }

}