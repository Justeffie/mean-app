import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatChipInputEvent} from "@angular/material";
import {ApiService} from "../../shared/api.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/index";
import {COMMA, ENTER} from "@angular/cdk/keycodes";

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit{
  formulario: FormGroup;
  subjectArray: Subject[] = [];
  subscription: Subscription;
  sectionInArray: any = ['A', 'B', 'C', 'D', 'E'];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('chipList', {static:false}) chipList;
  @ViewChild('resetStudentForm', {static: false}) myNgForm;

  constructor(private studentService: ApiService, private ngZone: NgZone, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formulario = new FormGroup({
      'name': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'section': new FormControl('', Validators.required),
      'subjects': new FormControl(this.subjectArray),
      'dob': new FormControl('', Validators.required),
      'gender': new FormControl('Male')
    })
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value: string = event.value;

    if ((value || '').trim() && this.subjectArray.length < 5) {
      this.subjectArray.push({name: value.trim()})
    }

    if (input) {
      input.value = '';
    }
  }

  remove(subject: Subject): void {
    const index = this.subjectArray.indexOf(subject);
    if (index >= 0) {
      this.subjectArray.splice(index, 1);
    }
  }

  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0,10);
    this.formulario.get('dob').setValue(convertDate, {onlyself: true});
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.formulario.controls[controlName].hasError(errorName);
  }

  submitStudentForm() {
    if (this.formulario.valid) {
      this.studentService.addStudent(this.formulario.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/students-list'));
      })
    }
  }
}
