import {NgModule} from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SingupComponent } from './singup/singup.component';
import { CommonModule } from '@angular/common';
import {AngularMaterialModule} from '../angular-material.module';
import { FormsModule} from '@angular/forms';
import {AuthRoutingModule} from './auth-routing.module';

@NgModule({
declarations:[
    LoginComponent,
    SingupComponent
],
imports:[
    CommonModule, 
    AngularMaterialModule,
    FormsModule,
    AuthRoutingModule
]
})
export class AuthModule {

}