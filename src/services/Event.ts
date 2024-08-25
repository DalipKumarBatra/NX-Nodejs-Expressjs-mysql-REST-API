import { query } from './dbQuery.services';
import { emptyOrRows, getOffset } from '../utils/helper.utils';
import { EventData, GetEvent } from '../utils/common';
import { listPerPage } from '../configs/general.config';
import { Request, Response } from 'express';

export class Event {
  getAllEvents = async (req: Request, res: Response) => {
    var page: number = 1;
    const offSet = getOffset(page, listPerPage());
    var sqlQuery = `SELECT e.*, 
                            comm.committee_name, 
                            group_concat(distinct(facUser.user_id)) as facilitators_id,
                            group_concat(distinct(facUser.fullName)) as facilitators_name
                        FROM events e
                        LEFT JOIN committees as comm ON(e.committee=comm.committee_id)
                        LEFT JOIN committee_user_mapping cum ON(cum.commId=comm.committee_id)
                        LEFT JOIN facilitator_map as fm ON(fm.eventId=e.id)
                        LEFT JOIN users as facUser ON (facUser.user_id=fm.facId)
                        GROUP BY e.id limit ?,?`;

    
    console.log(sqlQuery);
    var rows1: any = await query(sqlQuery, [offSet, listPerPage()])
    console.log(rows1);
    var rows: any = await query(sqlQuery, [offSet, listPerPage()])
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .catch((err) => {
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  getEventById = async (req: Request, res: Response) => {
    var page: number = 1;
    const offSet = getOffset(page, listPerPage());
    var sqlQuery = `SELECT 
                        e.*, c.committee_name, 
                          GROUP_CONCAT(f.facId) as facilitator, 
                          GROUP_CONCAT(uir.user_id) as fac_user_id, 
                          GROUP_CONCAT(uir.emp_code) as fac_emp_code, 
                          GROUP_CONCAT(CONCAT(uir.first_name, ' ', uir.last_name)) as fullname
                      FROM events as e
                      LEFT JOIN committees as c ON(e.committee = c.committee_id)
                      LEFT JOIN facilitator_map as fam ON(e.id = fam.eventId)
                      LEFT JOIN facilitators as f ON(fam.facId = f.facId)
                      LEFT JOIN user_info_requisition as uir ON(f.fac_user_id = uir.user_id)
                      WHERE e.id = ? limit ?,?`;
    var rows: any = await query(sqlQuery, [
      req.params.id,
      offSet,
      listPerPage(),
    ])
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .catch((err) => {
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  getRegEventByUserEmail = async (req: Request, res: Response) => {
    var sqlQuery = `SELECT json_arrayagg(e.eventId) as registerEvent FROM event_registration e where e.email = 'rahul@qasource.com'`;
    var rows: any = await query(sqlQuery, [req.params.email])
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .catch((err) => {
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  getEventsByStatus = async (req: Request, res: Response) => {
    var page: number = 1;
    const offSet = getOffset(page, listPerPage());
    var sqlQuery = `SELECT 
                            e.*, GROUP_CONCAT(u.fullname SEPARATOR ',') as facilitators_name, c.committee_name, 
                            group_concat(distinct(u.user_id)) as facilitators_id
                        FROM events e 
                        LEFT JOIN facilitator_map fm ON e.id = fm.eventId 
                        LEFT JOIN users u on u.user_id = fm.facId 
                        LEFT JOIN committees c ON e.committee = c.committee_id
                        WHERE e.status = ?
                        group by e.id limit ?,?`;
    var rows: any = await query(sqlQuery, [
      req.params.status,
      offSet,
      listPerPage(),
    ])
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .catch((err) => {
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  getUpcomingAndLiveEvents = async (req: Request, res: Response) => {
    var page: number = 1;
    const offSet = getOffset(page, listPerPage());
    var sqlQuery = `SELECT 
                        e.*, GROUP_CONCAT(u.fullname SEPARATOR ',') as facilitators_name, c.committee_name, 
                        group_concat(distinct(u.user_id)) as facilitators_id
                    FROM events e 
                    LEFT JOIN facilitator_map fm ON e.id = fm.eventId 
                    LEFT JOIN users u on u.user_id = fm.facId 
                    LEFT JOIN committees c ON e.committee = c.committee_id
                    WHERE e.status = 'live' OR e.status = 'upcoming'
                    group by e.id order by e.status limit ?,?;`;
    var rows: any = await query(sqlQuery, [offSet, listPerPage()])
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .catch((err) => {
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  getFilteredEvents = async (req: Request, res: Response) => {
    var page: number = 1;
    const offSet = getOffset(page, listPerPage());
    var sqlQuery = `SELECT 
                            e.*, c.committee_name 
                        FROM events as e
                        LEFT JOIN committees as c on(e.committee = c.committee_id)
                        where ${
                          req.query.status !== '' && req.query.type === ''
                            ? 'e.status = ?'
                            : req.query.type !== '' && req.query.status === ''
                            ? 'c.committee_name = ?'
                            : 'e.status = ? AND c.committee_name = ?'
                        }
                        limit ?,?`;
    var rows: any = await query(
      sqlQuery,
      req.query.status !== '' && req.query.type === ''
        ? [req.query.status, offSet, listPerPage()]
        : req.query.status === '' && req.query.type !== ''
        ? [req.query.type, offSet, listPerPage()]
        : [req.query.status, req.query.type, offSet, listPerPage()]
    )
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .catch((err) => {
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  eventParticipants = async (req: Request, res: Response) => {
    let eventId = req.query.event_id;
    var page: number = 1;
    const offSet = getOffset(page, listPerPage());
    var sqlQuery = `SELECT * FROM event_registration
                        WHERE eventId = '${eventId}'`;
    var rows: any = await query(sqlQuery, [offSet, listPerPage()])
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .catch((err) => {
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  getTotalParticipants = async (req: Request, res: Response) => {
    var page: number = 1;
    const offSet = getOffset(page, listPerPage());
    var sqlQuery = `SELECT * FROM event_registration as eg group by eg.email`;
    var rows: any = await query(sqlQuery, [offSet, listPerPage])
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .then((data) => console.log(data))
      .catch((err) => {
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  addEvent = async (req: Request, res: Response) => {
    var sqlQuery = await query(
      `Insert into events ( title, description, committee, startDate, startTime, unsubscribeEndDate, endDate, endTime, location, imageUrl, status ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        // Mock
        req.body.staticFields.title,
        req.body.staticFields.description,
        req.body.staticFields.committee,
        req.body.staticFields.startDate,
        req.body.staticFields.startTime,
        req.body.staticFields.unsubscribeEndDate,
        req.body.staticFields.endDate,
        req.body.staticFields.endTime,
        req.body.staticFields.location,
        req.body.staticFields.imageUrl,
        'upcoming',
      ]
    )
      .then((response) => {
        let obj = Object(response);

        let objFacilitator = {
          eventId: obj.insertId,
          facId: req.body.staticFields.facilitator, // Mock
        };
        this.addEventFacilitators(objFacilitator); 

        this.addDynamicFields(req, res, obj.insertId, 'add');
        return res.status(201).json({ data: response }).send({message: `${req.body.staticFields.title} Event added successfully`});
      })
      .catch((err) => {
        console.log('CAUGHT ERROR', err);
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  addEventFacilitators = async (objFacilitator: any) => {
    objFacilitator.facId.map(async function (facId) {
      var sqlQuery = await query(
        `Insert into facilitator_map ( eventId, facId ) values (?, ?)`,
        [objFacilitator.eventId, facId]
      );
    });
    // return true; 
  };

  removeOldFacilitatorByEventId = async (
    eventId: number,
    objFacilitator: any
  ) => {
    var sqlQuery = await query('DELETE FROM facilitator_map WHERE eventId=?', [
      eventId,
    ]).then((response) => this.addEventFacilitators(objFacilitator));
    return true;
  };

  // updateEvent = async (req:Request, res:Response) => {
  //     var sqlQuery = await query('Update events SET title=?, description=?, attendees=?, committee=?, startDate=?, startTime=?, duration=?, imageUrl=? where id=?',
  //         [
  //             req.body.data.title,
  //             req.body.data.description,
  //             req.body.data.noOfAttendees,
  //             req.body.data.committee,
  //             req.body.data.startDate,
  //             req.body.data.startTime,
  //             req.body.data.duration,
  //             req.body.data.imageUrl,
  //             req.params.id
  //         ]
  //     )
  //     .then((response)=>{
  //         let obj = Object(response);
  //         let objFacilitator = {
  //             "eventId": req.params.id,
  //             "facId": req.body.data.facilitator
  //         }
  //         this.removeOldFacilitatorByEventId(parseInt(req.params.id), objFacilitator)
  //         res.status(200).json({ data: response });
  //     })
  //     .catch((err) => {
  //         console.log("CAUGHT ERROR", err);
  //         res.status(500).send({message : 'An unknown error occurred.'});
  //     });
  // };

  updateEventStatus = async (req: Request, res: Response) => {
    var sqlQuery = await query('Update events SET status=? where id=?', [
      req.query.status,
      req.query.event_id,
    ])
      .then((response) => {
        console.log('Event Added successfully', response);
        res.status(201).json({ data: response });
      })
      .catch((err) => {
        console.log('CAUGHT ERROR', err);
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  updateConfirmParticipation = async (req: Request, res: Response) => {
    var sqlQuery = await query(
      'Update event_registration SET confirm_participation=? where id=?',
      [req.query.confirm_participation, req.query.id]
    )
      .then((response) => {
        console.log('Event Added successfully', response);
        res.status(201).json({ data: response });
      })
      .catch((err) => {
        console.log('CAUGHT ERROR', err);
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  deleteEvent = async (req, res) => {
    var sqlQuery = await query('DELETE FROM events WHERE id=?', [
      req.params.id,
    ]);

    let message = 'Error in deleting Event';

    if (sqlQuery) {
      message = 'Event deleted successfully';
    }

    res.status(200).json({ message });
  };

  registerEventParticipant = async (req: Request, res: Response) => {
    var sqlQuery = await query(
      `Insert into event_registration ( eventId, fullname, email, level ) values (?, ?, ?, ?)`,
      [
        req.body.event_id,
        req.body.complete_name,
        req.body.email, 
        req.body.skill,
      ]
    )
      .then((response) => {
        console.log('Registered successfully');
        res.status(200).json({ data: response });
        return;
      })
      .catch((err) => {
        if (err) throw err;
        console.log('CAUGHT ERROR', err);
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  removeParticipationFromEvent = async (req, res) => {
    var sqlQuery = await query(
      'DELETE FROM event_registration WHERE email=? AND eventId=?',
      [req.query.email, req.query.id]
    );

    let message = 'Error in removing participation from Event';

    if (sqlQuery) {
      message = 'Participation removed from Event successfully';
    }

    res.status(200).json({ message });
  };

  getMyEventsByUserEmail = async (req: Request, res: Response) => {
    var page: number = 1;
    const offSet = getOffset(page, listPerPage());
    var sqlQuery = `SELECT 
                            e.*
                            -- json_arrayagg(ereg.eventId) as registerEvent 
                        FROM event_registration ereg
                        LEFT JOIN events as e on (e.id = ereg.eventId)
                        where ereg.email = 'rahul@qasource.com' and e.id is not null
                        limit ?,?`;
    var rows: any = await query(sqlQuery, [offSet, listPerPage()])
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .catch((err) => {
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };



  // addDynamicFields = async (req: Request, res: Response, eventId) => {
  //     // Mock
  //     let dynamicFields = req.body.dynamicFields;
  //     for(let i = 0; i <= (dynamicFields.length-1); i++) {
  //         this.handleInputFields(req, res, eventId, dynamicFields[i]);
  //     };
  //     return;
  // };

  /**
   * handleTextField - Function to save Text field by EventID
   * @param eventId
   * @param data
   */
  handleInputFields = async (
    req: Request,
    res: Response,
    eventId,
    item: any
  ) => {
    console.log('>>>>>>>>>>item>>>>>>>>>>>', item)
    var sqlQuery = await query(
      `Insert into dynamic_input_fields ( event_id, field_type, field_label, field_name, is_multi_select, is_required ) values (?, ?, ?, ?, ?, ?)`,
      [
        parseInt(eventId),
        item.fieldType,
        item.fieldLabel,
        item.fieldName,
        item.isMultiSelect === undefined ? null : item.isMultiSelect,
        item.isRequired === undefined ? null : item.isRequired,
      ]
    )
      .then((response) => {
        console.log(item.type, ' field added successfully!');
        if (item.fieldType == 'select' || item.fieldType == 'radio') {
          let obj = Object(response);
          // Add select options
          this.addSelectOptions(req, res, obj.insertId, item.options);
          // return;
        }
        // return response;
      })
      .catch((err) => {
        if (err) throw err;
        console.log('CAUGHT ERROR', err);
        return res.status(500)//.send({ message: 'An unknown error occurred.' });
      });
  };

  /**
   * addSelectOptions - Function to save Options of Select field
   * @param lastInsertId
   * @param options
   */
  addSelectOptions = async (req, res, lastInsertId, options) => {
    console.log('>>>>>>>>>>>>>>options>>>>', options)
    options.map(async function (item) {
      var sqlQuery = await query(
        `Insert into dynamic_select_field_options ( select_id, value, label ) values (?, ?, ?)`,
        [lastInsertId, item.value, item.label]
      )
        .then((response) => {
          console.log('Option added successfully!');
          // return;
        })
        .catch((err) => {
          if (err) throw err;
          console.log('CAUGHT ERROR', err);
          return res
            .status(500)
            //.send({ message: 'An unknown error occurred.' });
        });
    });
  };

  dynamicInputField = async (req: Request, res: Response) => {
    var page: number = 1;
    const offSet = getOffset(page, listPerPage());
    var sqlQuery = `SELECT 
                      dif.field_type as fieldType, dif.field_label as fieldLabel, 
                      dif.field_name as fieldName, dif.is_multi_select as isMultiSelect, 
                      dif.is_required as isRequired, dif.id as id, dif.event_id as eventId 
                    FROM dynamic_input_fields as dif 
                    WHERE (field_type  = 'text' OR field_type  = 'date' OR field_type  = 'number') AND event_id = ? limit ?,?`;
    var rows: any = await query(sqlQuery, [
      req.params.id,
      offSet,
      listPerPage(),
    ])
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .catch((err) => {
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  dynamicSelectField = async (req: Request, res: Response) => {
    try {
      const offSet = getOffset(1, listPerPage());
      const sqlQuery = `SELECT 
                          dif.*, dsfo.id as optionId, dsfo.select_id, 
                          dsfo.label as optionLabel, dsfo.value
                        FROM dynamic_input_fields as dif
                        LEFT JOIN dynamic_select_field_options as dsfo ON(dif.id=dsfo.select_id)
                        WHERE dif.event_id=? and dif.field_type="select" LIMIT ?, ?`;
      const data: any = await query(sqlQuery, [
        req.params.id,
        offSet,
        listPerPage(),
      ]);
      const rearrangedData = data.reduce((acc, item) => {
        const existingItemIndex = acc.findIndex((el) => el.id === item.id);
        if (existingItemIndex !== -1) {
          // Item already exists, add the option to the existing item's options array
          acc[existingItemIndex].options.push({
            optionId: item.optionId,
            value: item.value,
            label: item.optionLabel,
          });
        } else {
          // Item doesn't exist, create a new item and add the option to its options array
          acc.push({
            id: item.id,
            eventId: item.event_id,
            fieldType: item.field_type,
            fieldName: item.field_name,
            fieldLabel: item.field_label,
            isRequired: item.is_required,
            isMultiSelect: item.is_multi_select,
            select_id: item.select_id,
            options: [
              {
                optionId: item.optionId,
                value: item.value,
                label: item.optionLabel,
              },
            ],
          });
        }
        return acc;
      }, []);

      res.status(200).json({ data: rearrangedData });
    } catch (err) {
      res.status(500).send({ message: 'An unknown error occurred.' });
    }
  };

  getSelectOptions = async (selectId, req: Request, res: Response) => {
    try {
      const offSet = getOffset(1, listPerPage());
      const sqlQuery = `SELECT *
                                FROM dynamic_select_field_options
                                WHERE selectId = ? LIMIT ?, ?`;
      const rows: any = await query(sqlQuery, [
        selectId,
        offSet,
        listPerPage(),
      ]);
      return rows;
    } catch (err) {
      res.status(500).send({ message: 'An unknown error occurred.' });
    }
  };

  dynamicDateField = async (req: Request, res: Response) => {
    var page: number = 1;
    const offSet = getOffset(page, listPerPage());
    var sqlQuery = `SELECT *
                        FROM dynamic_input_fields 
                        where field_type  = 'date' AND event_id = ? limit ?,?`;
    var rows: any = await query(sqlQuery, [
      req.params.id,
      offSet,
      listPerPage(),
    ])
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .catch((err) => {
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  dynamicNumberField = async (req: Request, res: Response) => {
    var page: number = 1;
    const offSet = getOffset(page, listPerPage());
    var sqlQuery = `SELECT *
                        FROM dynamic_input_fields 
                        where field_type  = 'number' AND event_d = ? limit ?,?`;
    var rows: any = await query(sqlQuery, [
      req.params.id,
      offSet,
      listPerPage(),
    ])
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .catch((err) => {
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  addDynamicFields = async (req: Request, res: Response, event_id, type: string) => {
    console.log('>>>>addDynamicFields>>>>>>>', req.body.dynamicFields)
    var sqlQuery = await query(
      'DELETE FROM dynamic_input_fields WHERE event_id=?',
      [event_id]
    ).then((response) => {
      let dynamicFields = type === 'add' ? req.body.dynamicFields : req.body.data.dynamicFields;
      console.log('>>>>>>>>>>>inside response of addDynamicFields>>>>>>>>>>>>>>', dynamicFields)
      for (let i = 0; i <= dynamicFields.length - 1; i++) {
        this.handleInputFields(req, res, event_id, dynamicFields[i]);
      }
      // return;
    }); 
    // return true;
  };

  updateEvent = async (req: Request, res: Response) => {
    var sqlQuery = await query(
      'Update events SET title=?, description=?, committee=?, startDate=?, startTime=?, unsubscribeEndDate=?, endDate=?, endTime=?, location=?, imageUrl=? where id=?',
      [
        req.body.data.staticFields.title,
        req.body.data.staticFields.description,
        req.body.data.staticFields.committee,
        req.body.data.staticFields.startDate,
        req.body.data.staticFields.startTime,
        req.body.data.staticFields.unsubscribeEndDate,
        req.body.data.staticFields.endDate,
        req.body.data.staticFields.endTime,
        req.body.data.staticFields.location,
        req.body.data.staticFields.imageUrl,
        req.params.id,
      ]
    )
      .then((response) => {
        let obj = Object(response);
        let objFacilitator = {
          eventId: req.params.id,
          facId: req.body.data.staticFields.facilitator,
        };
        this.removeOldFacilitatorByEventId(
          parseInt(req.params.id),
          objFacilitator
        );

        this.addDynamicFields(req, res, req.params.id, "edit");
        return res.status(201).json({ data: response });
      })
      .catch((err) => {
        console.log('CAUGHT ERROR', err);
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  getEventsBasedOnCommittee = async (req: Request, res: Response) => {
    var page: number = 1;
    const offSet = getOffset(page, listPerPage());
    var sqlQuery = `SELECT 
                      e.*, c.committee_name as committee_name
                    FROM events as e 
                    LEFT JOIN committees as c ON(e.committee = c.committee_id)
                    WHERE c.committee_name = ? limit ?,?;`;
    var rows: any = await query(sqlQuery, [req.params.committee, offSet, listPerPage()])
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .catch((err) => {
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };

  getEventsForCommitteeByStatus = async (req: Request, res: Response) => {
    var page: number = 1;
    const offSet = getOffset(page, listPerPage());
    var sqlQuery = `SELECT 
                      e.*, c.committee_name as committee_name
                    FROM events as e 
                    LEFT JOIN committees as c ON(e.committee = c.committee_id)
                    WHERE c.committee_name = ? AND e.status= ? limit ?,?;`;
    var rows: any = await query(sqlQuery, [
      req.query.committee,
      req.query.status,
      offSet,
      listPerPage(),
    ])
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .catch((err) => {
        res.status(500).send({ message: 'An unknown error occurred.' });
      });
  };
}

// getMyEventsByCommittee = async (req: Request, res: Response) => {
//   var page: number = 1;
//   const offSet = getOffset(page, listPerPage());
//   var sqlQuery = `SELECT 
//                           e.*
//                           -- json_arrayagg(ereg.eventId) as registerEvent 
//                       FROM event_registration ereg
//                       LEFT JOIN events as e on (e.id = ereg.eventId)
//                       where ereg.email = 'rahul@qasource.com' and e.id is not null
//                       limit ?,?`;
//   var rows: any = await query(sqlQuery, [offSet, listPerPage()])
//     .then((response) => {
//       res.status(200).json({ data: response });
//     })
//     .catch((err) => {
//       res.status(500).send({ message: 'An unknown error occurred.' });
//     });
// };

// getMyEventsByUserId = async (req: Request, res: Response) => {
//   var page: number = 1;
//   const offSet = getOffset(page, listPerPage());
//   var sqlQuery = `SELECT 
//                           e.*
//                           -- json_arrayagg(ereg.eventId) as registerEvent 
//                       FROM event_registration ereg
//                       LEFT JOIN events as e on (e.id = ereg.eventId)
//                       where ereg.email = 'rahul@qasource.com' and e.id is not null
//                       limit ?,?`;
//   var rows: any = await query(sqlQuery, [offSet, listPerPage()])
//     .then((response) => {
//       res.status(200).json({ data: response });
//     })
//     .catch((err) => {
//       res.status(500).send({ message: 'An unknown error occurred.' });
//     });
// };

