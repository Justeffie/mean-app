import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../../shared/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatChipInputEvent} from "@angular/material";
import {Subject} from "../add-student/add-student.component";
import {Subscription} from "rxjs/index";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Student} from "../../shared/student";

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit, OnDestroy {
  formulario: FormGroup;
  subjectArray = [];
  subjct = [];
  subscription: Subscription;
  student;
  sectionInArray: any = ['A', 'B', 'C', 'D', 'E'];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('chipList', {static:false}) chipList;
  @ViewChild('resetStudentForm', {static: false}) myNgForm;

  constructor(private studentService: ApiService, private ngZone: NgZone, private actRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.initForm();
    let id = this.actRoute.snapshot.paramMap.get('id');
    if (id) {
      this.subscription = this.studentService.getStudent(id).subscribe((student: Student) => {
        this.subjectArray.push(...student.subjects);
        this.setValuesForm(student);
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initForm() {
    this.formulario = new FormGroup({
      'name': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'section': new FormControl('', Validators.required),
      'dob': new FormControl('', Validators.required),
      'gender': new FormControl('Male'),
      'subjects': new FormControl(this.subjectArray)
    })
  }

  setValuesForm(student) {
    this.formulario.setValue({
      name: student.name,
      email: student.email,
      dob: student.dob,
      gender: student.gender,
      section: student.section,
      subjects: student.subjects
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim() && this.subjectArray.length < 5) {
      this.subjectArray.push({name: value.trim()});
    }

    if (input) {
      input.value = '';
    }
  }

  remove(subject): void {
    const index = this.subjectArray.indexOf(subject);
    if (index >= 0) {
      this.subjectArray.splice(index, 1);
    }

    this.formulario.controls['subjects'].setValue(this.subjectArray);
  }

  formatDate(e) {
    let converDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.formulario.get('dob').setValue(converDate, {
      onlyself: true
    });
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.formulario.controls[controlName].hasError(errorName);
  }

  updateStudent() {
    console.log(this.formulario.value);
    let id = this.actRoute.snapshot.paramMap.get('id');
    if (window.confirm('Are you sure want to update?')) {
      this.studentService.updateStudent(id, this.formulario.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/students-list'))
      });
    }
  }
}
