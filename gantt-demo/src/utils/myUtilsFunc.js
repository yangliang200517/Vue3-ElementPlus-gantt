import dayjs from 'dayjs'

// 格式化年月日的函数  
export const formatDateYYYYMMDD = (dateString, format = 'YYYY-MM-DD') => {  
  // 使用dayjs解析日期字符串（假设dateString是一个有效的日期字符串）  
  const date = dayjs(dateString)
    
  // 如果解析失败，返回一个错误字符串或默认值  
  if (!date.isValid()) {  
    return '0000-00-00'
  }  
    
  // 使用dayjs的format函数来格式化日期  
  return date.format(format)
}

/*
* 该方法主要实现的功能是过滤为空的数据，实现后端所说的：查什么传什么，为空的字段就不要传递的小需求
* 该方法接收一个表单对象，把表单中为 空字符串、null、undefined 或 []的数据过滤掉，只留下有数据的字段并返回一个新的对象
* */
export const filterNonEmptyValues = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) =>
            value != null && value !== '' && !(Array.isArray(value) && value.length === 0)
        )
    );
}


// 模拟接口数据
export const getProjectUserData = (searchTerm) => {
    const data = {
        "data": {
            "startDate": "2024-11-01",
            "endDate": "2024-11-30",
            "userPageResult": {
                "items": [
                    {
                        "lowerDisplayName": "张三",
                        "avatarUrl": "",
                        "hasChildren": true,
                        "children": [],
                        "proportion": 0.6667,
                        "id": 10166
                    },
                    {
                        "lowerDisplayName": "李四",
                        "hasChildren": true,
                        "children": [],
                        "proportion": 0.6842,
                        "id": 10535
                    },
                    {
                        "lowerDisplayName": "王五",
                        "hasChildren": true,
                        "children": [],
                        "proportion": 0,
                        "id": 10576
                    },
                    {
                        "lowerDisplayName": "赵六",
                        "avatarUrl": "",
                        "hasChildren": true,
                        "children": [],
                        "proportion": 0.25,
                        "id": 10398
                    },
                    {
                        "lowerDisplayName": "老七",
                        "avatarUrl": "",
                        "hasChildren": true,
                        "children": [],
                        "proportion": 0,
                        "id": 10377
                    },
                    {
                        "lowerDisplayName": "老六",
                        "hasChildren": true,
                        "children": [],
                        "proportion": 0.4,
                        "id": 10159
                    },
                    {
                        "lowerDisplayName": "张八",
                        "avatarUrl": "",
                        "hasChildren": true,
                        "children": [],
                        "proportion": 0.5625,
                        "id": 11583
                    },
                    {
                        "lowerDisplayName": "赵柳",
                        "hasChildren": true,
                        "children": [],
                        "proportion": 0.625,
                        "id": 10580
                    },
                    {
                        "lowerDisplayName": "张十",
                        "avatarUrl": "",
                        "hasChildren": true,
                        "children": [],
                        "proportion": 0.3333,
                        "id": 10163
                    },
                    {
                        "lowerDisplayName": "李二",
                        "avatarUrl": "",
                        "hasChildren": true,
                        "children": [],
                        "proportion": 0.9474,
                        "id": 10389
                    }
                ],
                "total": 10
            }
        }
    }
    
    if (Object.keys(searchTerm).length === 0 || !searchTerm.lowerDisplayName) {
        return data;
    }

    const filteredItems = data.data.userPageResult.items.filter(item => 
        item.lowerDisplayName.toLowerCase().includes(searchTerm.lowerDisplayName.toLowerCase())
    );
    
    return {
        data: {       
            startDate: data.data.startDate,
            endData: data.data.endData,
            userPageResult: {
                ...data.userPageResult,
                items: filteredItems,
                total: filteredItems.length
            }
        }
    };
}

export const getUserProjectList = (filterData) => {
    const projects = [
        {
            "issuestatus": "10001",
            "issuetype": "10002",
            "estimatedStartTime": "2024-11-01 00:00:00",
            "estimatedEndTime": "2024-11-07 00:00:00",
            "id": 11163,
            "summary": "任务一",
            "priority": "1"
        },
        {
            "issuestatus": "3",
            "issuetype": "10002",
            "estimatedStartTime": "2024-11-01 00:00:00",
            "estimatedEndTime": "2024-11-07 00:00:00",
            "id": 11162,
            "summary": "任务二",
            "priority": "3"
        },
        {
            "issuestatus": "3",
            "issuetype": "10002",
            "estimatedStartTime": "2024-11-01 00:00:00",
            "estimatedEndTime": "2024-11-30 00:00:00",
            "id": 11162,
            "summary": "任务三",
            "priority": "3"
        },
        {
            "issuestatus": "10001",
            "issuetype": "10002",
            "estimatedStartTime": "2024-11-03 00:00:00",
            "estimatedEndTime": "2024-11-15 00:00:00",
            "id": 11164,
            "summary": "任务四",
            "priority": "1"
        },
        {
            "issuestatus": "10001",
            "issuetype": "10002",
            "estimatedStartTime": "2024-11-06 00:00:00",
            "estimatedEndTime": "2024-11-20 00:00:00",
            "id": 11165,
            "summary": "任务五",
            "priority": "1"
        },
        {
            "issuestatus": "10001",
            "issuetype": "10002",
            "estimatedStartTime": "2024-11-06 00:00:00",
            "estimatedEndTime": "2024-11-11 00:00:00",
            "id": 11166,
            "summary": "任务六",
            "priority": "1"
        },
        {
            "issuestatus": "10001",
            "issuetype": "10002",
            "estimatedStartTime": "2024-11-08 00:00:00",
            "estimatedEndTime": "2024-11-25 00:00:00",
            "id": 11167,
            "summary": "任务七",
            "priority": "1"
        },
        {
            "issuestatus": "10000",
            "issuetype": "10002",
            "estimatedStartTime": "2024-11-25 00:00:00",
            "estimatedEndTime": "2024-11-30 00:00:00",
            "id": 11177,
            "summary": "任务八",
            "priority": "1"
        },
        {
            "issuestatus": "10000",
            "issuetype": "10002",
            "estimatedStartTime": "2024-12-01 00:00:00",
            "estimatedEndTime": "2024-12-15 00:00:00",
            "id": 11178,
            "summary": "任务九",
            "priority": "1"
        }
    ]
    
    
    //  如果是空对象就返回所有数据
    if (Object.keys(filterData).length === 0 || filterData.hasOwnProperty('lowerDisplayName')) {
        return { data: projects };
    }
    console.log(filterData);
    // 根据筛选条件返回对应数据
    const filteredProjects = projects.filter(project => {
        return Object.keys(filterData).every(key => project[key] === String(filterData[key]));
    });
    console.log(filteredProjects);
    return { data: filteredProjects };
}