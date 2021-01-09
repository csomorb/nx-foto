import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    // private router: Router,
    private authService: AuthService,
    private toast: ToastrService
    ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  createUser(){
    if (this.registerForm.invalid){
      this.toast.error('Erreur',
          'Complétez correctement le formulaire',
          {timeOut: 4000,});
      return;
    }
    this.authService.register(this.registerForm.value.username, this.registerForm.value.password,
      this.registerForm.value.email, this.registerForm.value.role).subscribe();
    console.log(this.registerForm.value);
    console.log(this.registerForm);
    // this.submitted = true;
    // // return for here if form is invalid
    // if (this.registerForm.invalid) {
    // return;
    // }
    // this.loading = true;
    // this.authService.register(this.registerForm.value).subscribe(
    // (data)=>{
    // alert('User Registered successfully!!');
    // this.router.navigate(['/login']);
    // },
    // (error)=>{
    // this.toastr.error(error.error.message, 'Error');
    // this.loading = false;
    // }
    // )

  }
}
