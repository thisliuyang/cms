#!/bin/bash

# 是否删除过期数据
expire_backup_delete="ON"
expire_days=7
backup_time=$(date +%Y%m%d%H%M)
backup_dir=./bak/mongo
mongo_docker_id=69c4d27aee1c

if [ ! -d $backup_dir ]; then
  mkdir -p $backup_dir
fi

# 备份指定数据库中数据
docker exec -i $mongo_docker_id mongodump -h 127.0.0.1 --port 27017 -d doracms2 -o /dump_$backup_time

docker cp $mongo_docker_id:/dump_$backup_time $backup_dir

docker exec -i $mongo_docker_id rm -rf /dump_$backup_time

# 删除过期数据
if [ "$expire_backup_delete" == "ON" -a "$backup_dir" != "" ]; then
  $(find $backup_dir/ -mtime +$expire_days | xargs rm -rf)
  echo "Expired backup data delete complete!"
fi
