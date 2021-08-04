import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../../shared/api.service";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {Student} from "../../shared/student";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.css']
})
export class StudentsListComponent implements OnInit, OnDestroy {

  studentData: any = [];
  datasource: MatTableDataSource<Student>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  subscription: Subscription;
  displayedColumns: string[] = ['_id', 'name', 'email', 'section', 'action'];
  constructor(private studentService: ApiService) { }

  ngOnInit() {
    this.subscription = this.studentService.getStudents().subscribe(data => {
      this.studentData = data;
      this.datasource = new MatTableDataSource<Student>(this.studentData);
      setTimeout(() => {
        this.datasource.paginator = this.paginator;
      }, 0);
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deleteStudent(index: number, e) {
    if (window.confirm('Are you sure?')) {
      const data = this.datasource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.datasource.data = data;
      this.studentService.deleteStudent(e._id).subscribe();
    }
  }

}
