if [ "`pgrep -af 'Tightener .*-N daemon'`" != "" ]; then
    echo "\n\n\n---------\n\nKilling daemon\n\n---------\n\n\n"
    pgrep -af 'Tightener.* -N daemon ' | xargs kill
else
    echo "\n\n\n---------\n\nDaemon not running\n\n---------\n\n\n"
fi

