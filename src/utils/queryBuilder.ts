type Populate = { path: string, select?: string, populate?: { path: string, select?: string } };

export interface QueryParams {
  [key: string]: any;
}

export default function queryBuilder(query: QueryParams) {
  /**
   * Sortition
   */
  let sortition: any = {
    sort: { _id: -1 }
  };

  if (query.sort) {
    sortition = { sort: {} };
    //?sort=price,-createdAt
    query.sort.split(",").map((item: string) => item).forEach((item: string) => {
      if (item.startsWith('-')) return sortition.sort[item.substring(1)] = -1;
      sortition.sort[item] = 1;
    });
  }

  /**
   * Population & Relations
   */
  let population: { populate: Populate[] } = { populate: [] };

  if (query.populate && query.populate.length) {
    // ?populate=user(username-email-books)$books(title),books$author,images
    query.populate.split(",").map((item: string) => item).forEach((field: string) => {
      let path: string;
      let mainSelects: string | undefined;
      let deepPopulate: { path: string; select?: string; } | undefined;

      if (field.includes('(') && !field.includes('$')) {
        let fieldParts = field.split('(');
        path = fieldParts[0];
        mainSelects = fieldParts[1].replaceAll('-', ' ').slice(0, -1);
      } else if (field.includes('(') && field.includes('$')) {
        let fieldParts = field.split('$');

        let mainPart = fieldParts[0];
        if (mainPart.includes('(')) {
          path = mainPart.split('(')[0];
          mainSelects = mainPart.split('(')[1].replaceAll('-', ' ').slice(0, -1);
        } else {
          path = mainPart;
        }

        fieldParts.slice(1).forEach((part: string) => {
          if (part.includes('(')) {
            deepPopulate = { path: part.split('(')[0], select: part.split('(')[1].replaceAll('-', ' ').slice(0, -1) };
          } else {
            deepPopulate = { path: part };
          }
        })

      } else if (field.includes('$') && !field.startsWith('$')) {
        path = field.split('$')[0];
        deepPopulate = { path: field.split('$')[1] };
      } else {
        path = field;
      }

      population.populate.push({ path: path, ...(mainSelects ? { select: mainSelects } : {}), ...(deepPopulate ? { populate: deepPopulate } : {}) });

    });
  }

  /**
   * Projection & Selects
   */
  let projection: any = null;

  if (query.select) {
    projection = {};
    // ?select=createdAt,title || ?select=-content
    let selections = query.select.split(",").map((item: string) => item);
    selections.forEach((item: string) => {
      if (item.startsWith('-')) return projection[item.substring(1)] = 0;
      projection[item] = 1;
    });
  }


  /**
   * Filtering
   */
  let filter: any = {};

  for (const key in query) {
    if (['sort', 'select', 'populate', 'limit', 'skip'].indexOf(key) !== -1) continue;
    // Guide ==> {Range Filter} -- [Array Filter] -- (Boolean Filter)

    //= Range Filter Creator
    if (query[key].startsWith('{')) {
      let value = query[key].replace('{', '').replace('}', '');
      // ?createdAt={16462938723~16462938723}
      if (value.includes('~')) {
        let rangeFrom = value.split('~')[0];
        let rangeTo = value.split('~')[1];

        filter[key] = { $gte: parseInt(rangeFrom), $lte: parseInt(rangeTo) }
      }
      // ?createdAt= >=16462938723
      else if (value.startsWith(">=")) filter[key] = { $gte: parseInt(value.substring(2)) };
      else if (value.startsWith("<=")) filter[key] = { $lte: parseInt(value.substring(2)) };
      else if (value.startsWith(">")) filter[key] = { $gt: parseInt(value.substring(1)) };
      else if (value.startsWith("<")) filter[key] = { $lt: parseInt(value.substring(1)) };
      else filter[key] = parseInt(value);
    }

    //= Array Filter Creator
    else if (query[key].startsWith('[')) {
      // ?tags=[apple,android]
      let value = query[key].replace('[', '').replace(']', '');
      let array: string[] = [];
      value.split(',').forEach((val: string) => array.push(val));
      filter[key] = { $in: array };
    }

    //= Boolean Filter Creator
    else if (query[key].startsWith('(')) {
      // ?onSale=(1)&off=(0)
      let value = query[key].replace('(', '').replace(')', '');
      if (value === "1") filter[key] = true;
      else if (value === "0") filter[key] = false;
    }

    //= Search Filter Creator
    else if (key === 'search') {
      // ?search=hassan ali
      filter.$text = {
        $search: query[key],
        $caseSensitive: true
      }
    }

    //= Other Queries
    else {
      filter[key] = query[key];
    }
  }

  return {
    sortition,
    population,
    projection,
    filter
  }
}