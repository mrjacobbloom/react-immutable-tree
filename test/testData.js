// This data is in a "custom" serialuzatino format, so it requires a serializer/deserializer
export function pojoData1() {
  return {
    "description": "Total",
    "time": {
      "start": 110.2,
      "end": 114.21
    },
    "children": [
      {
        "description": "Grow The Plants",
        "time": {
          "start": 0.5,
          "end": 1.5
        },
        "children": [
          {
            "description": "Buy the seeds",
            "time": {
              "start": 0.5,
              "end": 1.5
            },
            "children": [
              {
                "description": "Go to the seed store",
                "time": {
                  "start": 0.5,
                  "end": 1.5
                },
                "children": [
                  {
                    "description": "Leave my house",
                    "time": {
                      "start": 0.5,
                      "end": 1.5
                    },
                    "children": [
                      {
                        "description": "Walk to the door",
                        "time": {
                          "start": 0.5,
                          "end": 1.5
                        },
                        "children": [
                          {
                            "description": "Get out of bed",
                            "time": {
                              "start": 0.5,
                              "end": 1.5
                            },
                            "children": [
                              {
                                "description": "Wake up",
                                "time": {
                                  "start": 0.5,
                                  "end": 1.5
                                },
                                "children": []
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "description": "Cook the plants",
        "time": {
          "start": 109.2,
          "end": 112.21
        },
        "children": [
          {
            "description": "Stir-fry the plants",
            "time": {
              "start": 109.2,
              "end": 112.21
            },
            "children": [
              {
                "description": "Buy oil",
                "time": {
                  "start": 6,
                  "end": 8
                },
                "children": []
              },
              {
                "description": "Buy pan",
                "time": {
                  "start": 9,
                  "end": 10
                },
                "children": []
              },
              {
                "description": "Go home",
                "time": {
                  "start": 0,
                  "end": 0
                },
                "children": []
              },
              {
                "description": "Put pan on stove",
                "time": {
                  "start": 36,
                  "end": 36
                },
                "children": []
              },
              {
                "description": "Put plants in pan",
                "time": {
                  "start": 1,
                  "end": 1.01
                },
                "children": []
              },
              {
                "description": "Turn on stove",
                "time": {
                  "start": 56,
                  "end": 56
                },
                "children": []
              },
              {
                "description": "Wait",
                "time": {
                  "start": 0.2,
                  "end": 0.2
                },
                "children": []
              },
              {
                "description": "TURN OFF STOVE!!!",
                "time": {
                  "start": 1,
                  "end": 1
                },
                "children": []
              }
            ]
          }
        ]
      },
      {
        "description": "Eat the plants",
        "time": {
          "start": 0.5,
          "end": 0.5
        },
        "children": []
      }
    ]
  };
}

export function pojoData1Deserializer(pojo) {
  return {
    data: { time: pojo.time, description: pojo.description },
    children: pojo.children,
  }
}

export function pojoData1Serializer(data, children) {
  return {
    description: data.description,
    time: data.time,
    children,
  }
}

// This data is in the "default" serialization format
export function pojoData2() {
  return {
    data: { name: 'Bob' },
    children: [
      {
        data: { name: 'Bob Jr.' },
        children: []
      },
      {
        data: { name: 'Bob Jr. 2' },
        children: [
          {
            data: { name: 'Bob Jr. 2 ||' },
            children: []
          },
        ]
      },
      {
        data: { name: 'Bob Jr. 3' },
        children: []
      },
    ]
  }
}
