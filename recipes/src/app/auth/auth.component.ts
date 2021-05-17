import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild('appPlaceholder', {read: ViewContainerRef}) alertHost;
  private closeSub: Subscription;

  constructor(private auth: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if(this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    this.isLoading = true;
    if(this.isLoginMode) {
      this.auth.signin(form.value.email, form.value.password)
      .subscribe((response) => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      })
    } else {
      this.auth.signup(form.value.email, form.value.password)
      .subscribe((response) => {
        console.log(response);
        this.isLoading = false;
      }, errorMessage => {
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      })
    }
    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  private showErrorAlert(message: string) {
    // creates a factory for our component
   const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
   // show where the element should be rendered
   const hostViewContainerRef = this.alertHost;
   hostViewContainerRef.clear();
   const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
   componentRef.instance.message = this.error;
   this.closeSub = componentRef.instance.close.subscribe(() => {
     this.closeSub.unsubscribe();
     hostViewContainerRef.clear();
   }) 
  } 
}
