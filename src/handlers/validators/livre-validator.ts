import Joi from "joi";

export const livreValidation = Joi.object<LivreRequest>({
    nom: Joi.string()
        .min(3)
        .required(),
    prix: Joi.number()
        .required(),
    nbTome: Joi.number()
        .required(),
    note: Joi.number()
        .required(),
    auteur: Joi.string()
        .required(),
}).options({ abortEarly: false })

export interface LivreRequest {
    nom: string;
    nbTome: number;
    auteur: string;
    prix: number;
    note: number;
}

export const listLivreValidation = Joi.object<ListLivreRequest>({
    nom: Joi.string().min(1).optional(),
    nbTome: Joi.number().min(1).optional(),
    auteur: Joi.string().min(1).optional(),
    prix: Joi.number().min(1).optional(),
    note: Joi.number().min(1).optional()
})


export interface ListLivreRequest {
    nom?: string;
    nbTome?: number;
    auteur?: string;
    prix?: number;
    note?: number;
}

export const updateLivreValidation = Joi.object<UpdateLivreRequest>({
    id: Joi.number().required(),
    nbTome: Joi.number().required(),
    note: Joi.number().required()

})

export interface UpdateLivreRequest {
    id: number
    nbTome: number
    note: number
}

export const livreIdValidation = Joi.object<LivreIdRequest>({
    id: Joi.number().required(),
})

export interface LivreIdRequest {
    id: number
}


export const livreNomValidation = Joi.object<LivreNomRequest>({
    nom: Joi.string().required(),
})

export interface LivreNomRequest {
    nom: string
}


export const livresNomsValidation = Joi.object({
    noms: Joi.array().items(Joi.string().required()).required()
});
