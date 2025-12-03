using { x_sap.samples.poetryslams.catering.x_Caterers as caterers } from '../db/catererManager';

extend service PoetrySlamService with{
    entity x_Caterers as projection on caterers;
}

