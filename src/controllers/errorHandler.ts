import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../helpers/errorHelper';

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
        res.status(err.status).json({ message: err.message, code: err.code });
    } else {
        // console.error(err.stack);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


// function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
//     if ('status' in err) { // Check if the error has a 'status' property
//         res.status((err as any).status).json({ message: err.message, code: (err as any).code });
//     } else {
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// }


function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    res.status(404).render('404')
    // res.json({ message: 'Not Found', code: 'NF10' });
}
export{errorHandler, notFoundHandler}