var {Command} = require('commander');
const readline = require('node:readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const chalk = require('chalk');
const { writeFile, readFile } = require('fs');
const path = './todos.json';

function addToJSON(task){
    readFile(path, (error, data) => {
        if (error) {
          console.log(error);
          return;
        }
        
        const parsedData = JSON.parse(data);
        let item = {id: parsedData.length +1, todo_task : task, completed : "Incomplete"};
        parsedData.push(item);
        
        writeFile(path, JSON.stringify(parsedData), (err) => {
          if (err) {
            console.log('Failed to write updated data to file');
            return;
          }
          console.log(chalk.green.bold('Task added successfully'));
          printTasks(parsedData);
          rl.close();
        });
      });
}

function printTasks(parsedData){  
    if (parsedData.length === 0) {
        console.log(chalk.red.bold('\nNo Tasks Available'));
    }
    else{
        console.log(chalk.blue.bold('\nCurrent To-Do: '));
        parsedData.forEach((item,index) => {
            console.log(chalk.blue(`${index  + 1}. ${item.todo_task} - ${item.completed}`));
        });
    }
}

function deleteTask(parsedData, index){
    parsedData.splice(index-1, 1);

    writeFile(path, JSON.stringify(parsedData), (err) => {
        if (err) {
          console.log('Failed to write updated data to file');
          return;
        }
        console.log(chalk.red.bold('Task deleted successfully'));
        printTasks(parsedData);
      });
}

function markTaskAsCompleted(parsedData, index){
    parsedData[index].completed = "Complete";

    writeFile(path, JSON.stringify(parsedData), (err) => {
        if (err) {
          console.log('Failed to write updated data to file');
          return;
        }
        console.log(chalk.yellow.bold('Task updated successfully'));
        printTasks(parsedData);
      });
}

const program = new Command();

program
  .name('index.js')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0');

program.command('add')
  .description('Add a task to to-do list')
  .argument('<string>', 'task you want to add')
  .action((str) => {   
    console.clear(); 
    addToJSON(str);
  });

  program.command('delete')
  .description('Delete a task from to-do list')
  .action(() => {    
    console.clear();
    readFile(path, (error, data) => {
        if (error) {
          console.log(error);
          return;
        }
        
        const parsedData = JSON.parse(data);
        printTasks(parsedData);
        rl.question(`Write index of the task you want to delete: `, index => {
            console.clear();
            deleteTask(parsedData,index);
            rl.close();
          });
    })
  });

  program.command('complete')
  .description('mark a task as completed from to-do list')
  .action(() => {  
    console.clear();  
    readFile(path, (error, data) => {
        if (error) {
          console.log(error);
          return;
        }
        
        const parsedData = JSON.parse(data);
        printTasks(parsedData);
        rl.question(`Write index of the task you want to mark as done: `, index => {
            console.clear();
            markTaskAsCompleted(parsedData,index-1);
            rl.close();
          });
    })
  });

program.parse();