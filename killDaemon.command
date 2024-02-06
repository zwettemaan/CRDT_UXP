if [ "`pgrep -af 'Tightener .*-N daemon'`" != "" ]; then
    echo "Killing daemon"
    pgrep -af 'Tightener.* -N daemon ' | xargs kill
else
    echo "Daemon not running"
fi

