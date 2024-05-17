#!/bin/bash
BOTFILE="/srv/averygames/avery_base/run.js" 
LOGFILE="/srv/averygames/avery_base/logs/botlog.log"
function start_app() {
    application_pid=$(cat process.pid)  
    if ps -p $application_pid > /dev/null
    then 
        echo "Please stop bot before"
    else 
        if $2
        then 
            truncate -s 0 $LOGFILE
        fi 
        # tested with this , uncomment your command
        nohup node --no-warnings $BOTFILE --ansi --color >> $LOGFILE  2>&1 &
        # write the pid to text to file to use it later
        app_pid=$!
        echo "Process started having PID $app_pid"
        # wait for process to check proper state, you can change this time accordingly 
        sleep 3
        if ps -p $app_pid > /dev/null
        then
            echo "Process successfully running having PID $app_pid"
            echo $app_pid > process.pid
        else
            echo "Process stopped before reached to steady state"
        fi
    fi
}

function stop_app() {
    # Get the PID from text file
    application_pid=$(cat process.pid)
    echo "stopping process, Details:"
    # print details
    ps -p $application_pid
    # check if running
    if ps -p $application_pid > /dev/null
    then
        # if running then kill else print message
        echo "Going to stop process having PId $application_pid"
        kill -s SIGTERM $application_pid
        WAIT_LOOP=0
        while ps -p "$application_pid" > /dev/null 2>&1; do
            sleep 1
            WAIT_LOOP=$((WAIT_LOOP+1))
            if [ "$WAIT_LOOP" = "$3" ]; then
                break
            fi
        done
        if [ $? -eq 0 ]; then
        echo "Process stopped successfully"
        else
        echo "Failed to stop process having PID $application_pid"
        fi
    else
        echo "Failed to stop process, Process is not running"
    fi
    sleep 2
}

function check_app() {
  application_pid=$(cat process.pid)
  ps -p $application_pid
}

case "$1" in
    start)   start_app ;;
    stop)    stop_app ;;
    check)   check_app ;;
    *) echo "usage: $0 start|stop|check" >&2
       exit 1
       ;;
esac
