import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../../api/tasks.js';

import template from './todosList.html';
 
class TodosListCtrl {
 constructor($scope) {
    $scope.viewModel(this);

    this.subscribe('tasks');

     this.hideCompleted = false;
 
 /*Helpers functions*/
   this.helpers({
      tasks() {
      	 const selector = {};
 
        // If hide completed is checked, filter tasks
        if (this.getReactively('hideCompleted')) {
          selector.checked = {
            $ne: true
          };
        }
        // Show newest tasks at the top
        return Tasks.find(selector, {
          sort: {
            createdAt: -1
          }
        });
      },
       incompleteCount() {
        return Tasks.find({
          checked: {
            $ne: true
          }
        }).count();
        },
      currentUser() {
        return Meteor.user();
      }

    })
   /*end helpers*/

  }/*end constructor*/

  addTask(newTask) {
    // Insert a task into the collection
     Meteor.call('tasks.insert', newTask);
    // Clear form
    this.newTask = '';
  }
  /*end of insert*/
  /*start for update*/
  setChecked(task) {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', task._id, !task.checked);
  }
  /*end for update*/
 /*start for delete*/
  removeTask(task) {
   Meteor.call('tasks.remove', task._id);
  }
  /*end for delete*/
  /*mark as private a task*/
  setPrivate(task) {
    Meteor.call('tasks.setPrivate', task._id, !task.private);
  }/*end*/
}
 
export default angular.module('todosList', [
  angularMeteor
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
   controller: ['$scope', TodosListCtrl]
  });